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
    "aws_api_gateway_integration._",
    "module.register",
    "module.reset",
  ]
}

# -----------------------------------------------------------------------------
# Resources: API Gateway: POST /
# -----------------------------------------------------------------------------

# aws_api_gateway_method._
resource "aws_api_gateway_method" "_" {
  rest_api_id   = "${aws_api_gateway_rest_api._.id}"
  resource_id   = "${aws_api_gateway_rest_api._.root_resource_id}"
  http_method   = "POST"
  authorization = "NONE"
}

# aws_api_gateway_integration._
resource "aws_api_gateway_integration" "_" {
  rest_api_id = "${aws_api_gateway_rest_api._.id}"
  resource_id = "${aws_api_gateway_rest_api._.root_resource_id}"
  http_method = "${aws_api_gateway_method._.http_method}"

  integration_http_method = "POST"
  type                    = "AWS_PROXY"

  uri = "arn:aws:apigateway:${
      var.region
    }:lambda:path/2015-03-31/functions/${
      aws_lambda_function._.arn
    }/invocations"
}

# -----------------------------------------------------------------------------
# Resources: Lambda
# -----------------------------------------------------------------------------

# aws_lambda_function._
resource "aws_lambda_function" "_" {
  function_name = "${var.namespace}"
  role          = "${aws_iam_role.lambda.arn}"
  runtime       = "nodejs8.10"
  filename      = "${path.module}/lambda/dist.zip"
  handler       = "handlers/index.post"
  timeout       = 10

  source_code_hash = "${
    base64sha256(file("${path.module}/lambda/dist.zip"))
  }"

  environment {
    variables = {
      COGNITO_USER_POOL        = "${aws_cognito_user_pool._.id}"
      COGNITO_USER_POOL_CLIENT = "${aws_cognito_user_pool_client._.id}"
      DYNAMODB_TABLE           = "${aws_dynamodb_table._.name}"
    }
  }
}

# aws_lambda_permission._
resource "aws_lambda_permission" "_" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = "${aws_lambda_function._.arn}"
  principal     = "apigateway.amazonaws.com"

  source_arn = "arn:aws:execute-api:${
      var.region
    }:${
      data.aws_caller_identity._.account_id
    }:${
      aws_api_gateway_rest_api._.id
    }/*/${
      aws_api_gateway_method._.http_method
    }/"
}

# -----------------------------------------------------------------------------
# Modules
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

  dynamodb_table = "${aws_dynamodb_table._.name}"

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

  dynamodb_table = "${aws_dynamodb_table._.name}"

  lambda_role_arn = "${aws_iam_role.lambda.arn}"
  lambda_filename = "${path.module}/lambda/dist.zip"
}
