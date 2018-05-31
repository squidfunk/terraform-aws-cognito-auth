# Copyright (c) 2018 Martin Donath <martin.donath@squidfunk.com>

# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to
# deal in the Software without restriction, including without limitation the
# rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
# sell copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:

# The above copyright notice and this permission notice shall be included in
# all copies or substantial portions of the Software.

# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NON-INFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
# FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
# IN THE SOFTWARE.

# -----------------------------------------------------------------------------
# Data: General
# -----------------------------------------------------------------------------

# data.aws_caller_identity._
data "aws_caller_identity" "_" {}

# -----------------------------------------------------------------------------
# Data: IAM
# -----------------------------------------------------------------------------

# data.template_file.cognito_iam_assume_role_policy.rendered
data "template_file" "cognito_iam_assume_role_policy" {
  template = "${
    file("${path.module}/iam/policies/assume-role/cognito-identity.json")
  }"

  vars {
    identity_pool_id = "${aws_cognito_identity_pool._.id}"
  }
}

# -----------------------------------------------------------------------------

# data.template_file.lambda_iam_policy.rendered
data "template_file" "lambda_iam_policy" {
  template = "${file("${path.module}/iam/policies/lambda.json")}"

  vars {
    pool_arn  = "${aws_cognito_user_pool._.arn}"
    table_arn = "${aws_dynamodb_table._.arn}"
    topic_arn = "${aws_sns_topic._.arn}"
  }
}

# -----------------------------------------------------------------------------
# Resources: IAM
# -----------------------------------------------------------------------------

# aws_iam_role.cognito
resource "aws_iam_role" "cognito" {
  name = "${var.namespace}-cognito"

  assume_role_policy = "${
    data.template_file.cognito_iam_assume_role_policy.rendered
  }"
}

# -----------------------------------------------------------------------------

# aws_iam_role.lambda
resource "aws_iam_role" "lambda" {
  name = "${var.namespace}-lambda"

  assume_role_policy = "${
    file("${path.module}/iam/policies/assume-role/lambda.json")
  }"
}

# aws_iam_policy.lambda
resource "aws_iam_policy" "lambda" {
  name = "${var.namespace}-lambda"

  policy = "${data.template_file.lambda_iam_policy.rendered}"
}

# aws_iam_policy_attachment.lambda
resource "aws_iam_policy_attachment" "lambda" {
  name = "${var.namespace}-lambda"

  policy_arn = "${aws_iam_policy.lambda.arn}"
  roles      = ["${aws_iam_role.lambda.name}"]
}

# -----------------------------------------------------------------------------
# Resource: Cognito
# -----------------------------------------------------------------------------

# aws_cognito_user_pool._
resource "aws_cognito_user_pool" "_" {
  name = "${var.namespace}"

  alias_attributes = [
    "email",
    "preferred_username",
  ]

  admin_create_user_config {
    allow_admin_create_user_only = false
  }

  password_policy {
    minimum_length    = 8
    require_lowercase = true
    require_numbers   = true
    require_symbols   = true
    require_uppercase = true
  }

  schema {
    name                = "email"
    attribute_data_type = "String"
    mutable             = false
    required            = true
  }

  lifecycle {
    ignore_changes = ["schema"]
  }
}

# aws_cognito_user_pool_client._
resource "aws_cognito_user_pool_client" "_" {
  name = "${var.namespace}"

  user_pool_id    = "${aws_cognito_user_pool._.id}"
  generate_secret = false

  explicit_auth_flows = [
    "ADMIN_NO_SRP_AUTH",
    "USER_PASSWORD_AUTH",
  ]
}

# aws_cognito_identity_pool._
resource "aws_cognito_identity_pool" "_" {
  identity_pool_name      = "${var.cognito_identity_pool}"
  developer_provider_name = "${var.cognito_identity_domain}"

  allow_unauthenticated_identities = false

  cognito_identity_providers {
    client_id               = "${aws_cognito_user_pool_client._.id}"
    server_side_token_check = true

    provider_name = "cognito-idp.${
        var.region
      }.amazonaws.com/${
        aws_cognito_user_pool._.id
      }"
  }
}

# aws_cognito_identity_pool_roles_attachment._
resource "aws_cognito_identity_pool_roles_attachment" "_" {
  identity_pool_id = "${aws_cognito_identity_pool._.id}"

  roles {
    "authenticated" = "${aws_iam_role.cognito.arn}"
  }
}

# -----------------------------------------------------------------------------
# Resources: DynamoDB
# -----------------------------------------------------------------------------

# aws_dynamodb_table._
resource "aws_dynamodb_table" "_" {
  name = "${var.namespace}-verification-codes"

  read_capacity  = 5
  write_capacity = 5
  hash_key       = "id"

  attribute {
    name = "id"
    type = "S"
  }

  ttl {
    attribute_name = "expires"
    enabled        = true
  }
}

# -----------------------------------------------------------------------------
# Resources: SNS
# -----------------------------------------------------------------------------

# aws_sns_topic._
resource "aws_sns_topic" "_" {
  name = "${var.namespace}-verification"
}

# -----------------------------------------------------------------------------
# Resources: API Gateway
# -----------------------------------------------------------------------------

# aws_api_gateway_rest_api._
resource "aws_api_gateway_rest_api" "_" {
  name = "${var.namespace}"
}

# aws_api_gateway_stage._
resource "aws_api_gateway_stage" "_" {
  stage_name    = "${var.api_stage}"
  rest_api_id   = "${aws_api_gateway_rest_api._.id}"
  deployment_id = "${aws_api_gateway_deployment._.id}"
}

# aws_api_gateway_deployment._
resource "aws_api_gateway_deployment" "_" {
  rest_api_id = "${aws_api_gateway_rest_api._.id}"

  # Hack: force deployment, see https://bit.ly/2kYXT3Q
  stage_description = "Deployed at ${timestamp()}"
  stage_name        = "intermediate"

  lifecycle {
    create_before_destroy = true
  }

  depends_on = [
    "module.authenticate",
    "module.register",
    "module.reset",
  ]
}

# -----------------------------------------------------------------------------
# Modules
# -----------------------------------------------------------------------------

# module.authenticate
module "authenticate" {
  source = "./modules/authenticate"

  namespace = "${var.namespace}"
  region    = "${var.region}"

  api_id          = "${aws_api_gateway_rest_api._.id}"
  api_resource_id = "${aws_api_gateway_rest_api._.root_resource_id}"

  cognito_user_pool        = "${aws_cognito_user_pool._.id}"
  cognito_user_pool_client = "${aws_cognito_user_pool_client._.id}"
  cognito_identity_domain  = "${var.cognito_identity_domain}"

  dynamodb_table = "${aws_dynamodb_table._.name}"
  sns_topic_arn  = "${aws_sns_topic._.arn}"

  lambda_role_arn = "${aws_iam_role.lambda.arn}"
  lambda_filename = "${path.module}/lambda/dist.zip"
}

# -----------------------------------------------------------------------------

# module.register
module "register" {
  source = "./modules/register"

  namespace = "${var.namespace}"
  region    = "${var.region}"

  api_id          = "${aws_api_gateway_rest_api._.id}"
  api_resource_id = "${aws_api_gateway_rest_api._.root_resource_id}"

  cognito_user_pool        = "${aws_cognito_user_pool._.id}"
  cognito_user_pool_client = "${aws_cognito_user_pool_client._.id}"
  cognito_identity_domain  = "${var.cognito_identity_domain}"

  dynamodb_table = "${aws_dynamodb_table._.name}"
  sns_topic_arn  = "${aws_sns_topic._.arn}"

  lambda_role_arn = "${aws_iam_role.lambda.arn}"
  lambda_filename = "${path.module}/lambda/dist.zip"
}

# -----------------------------------------------------------------------------

# module.reset
module "reset" {
  source = "./modules/reset"

  namespace = "${var.namespace}"
  region    = "${var.region}"

  api_id          = "${aws_api_gateway_rest_api._.id}"
  api_resource_id = "${aws_api_gateway_rest_api._.root_resource_id}"

  cognito_user_pool        = "${aws_cognito_user_pool._.id}"
  cognito_user_pool_client = "${aws_cognito_user_pool_client._.id}"
  cognito_identity_domain  = "${var.cognito_identity_domain}"

  dynamodb_table = "${aws_dynamodb_table._.name}"
  sns_topic_arn  = "${aws_sns_topic._.arn}"

  lambda_role_arn = "${aws_iam_role.lambda.arn}"
  lambda_filename = "${path.module}/lambda/dist.zip"
}
