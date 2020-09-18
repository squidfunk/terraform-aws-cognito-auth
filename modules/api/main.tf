# Copyright (c) 2018-2019 Martin Donath <martin.donath@squidfunk.com>

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
# Data: IAM
# -----------------------------------------------------------------------------

# data.template_file.lambda_iam_policy.rendered
data "template_file" "lambda_iam_policy" {
  template = file("${path.module}/iam/policies/lambda.json")

  vars = {
    cognito_user_pool_arn = "${var.cognito_user_pool_arn}"
    dynamodb_table_arn    = "${aws_dynamodb_table._.arn}"
    sns_topic_arn         = "${aws_sns_topic._.arn}"
  }
}

# -----------------------------------------------------------------------------
# Resources: IAM
# -----------------------------------------------------------------------------

# aws_iam_role.lambda
resource "aws_iam_role" "lambda" {
  name = "${var.namespace}-api-lambda"

  assume_role_policy = "${
    file("${path.module}/iam/policies/assume-role/lambda.json")
  }"
}

# aws_iam_policy.lambda
resource "aws_iam_policy" "lambda" {
  name = "${var.namespace}-api-lambda"

  policy = "${data.template_file.lambda_iam_policy.rendered}"
}

# aws_iam_policy_attachment.lambda
resource "aws_iam_policy_attachment" "lambda" {
  name = "${var.namespace}-api-lambda"

  policy_arn = "${aws_iam_policy.lambda.arn}"
  roles      = ["${aws_iam_role.lambda.name}"]
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

# aws_api_gateway_resource._
resource "aws_api_gateway_resource" "_" {
  rest_api_id = "${aws_api_gateway_rest_api._.id}"
  parent_id   = "${aws_api_gateway_rest_api._.root_resource_id}"
  path_part   = "identity"
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
  stage_name  = "intermediate"

  # Hack: force deployment on source code hash change
  variables = {
    "source_code_hash" = "${
      sha256(filebase64("${path.module}/lambda/dist.zip"))
    }"
  }

  lifecycle {
    create_before_destroy = true
  }

  depends_on = [
    module.authenticate,
    module.leave,
    module.register,
    module.reset,
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
  api_resource_id = "${aws_api_gateway_resource._.id}"
  api_base_path   = "${aws_api_gateway_resource._.path_part}"

  cognito_user_pool_id           = "${var.cognito_user_pool_id}"
  cognito_user_pool_client_id    = "${var.cognito_user_pool_client_id}"
  cognito_identity_pool_provider = "${var.cognito_identity_pool_provider}"

  dynamodb_table = "${aws_dynamodb_table._.name}"
  sns_topic_arn  = "${aws_sns_topic._.arn}"

  lambda_role_arn = "${aws_iam_role.lambda.arn}"
  lambda_filename = "${path.module}/lambda/dist.zip"

  zoho_id = var.zoho_id
  zoho_refresh_token = var.zoho_refresh_token
  zoho_secret = var.zoho_secret
  zoho_token = var.zoho_token
}

# module.leave
module "leave" {
  source = "./modules/leave"

  namespace = "${var.namespace}"
  region    = "${var.region}"

  api_id          = "${aws_api_gateway_rest_api._.id}"
  api_resource_id = "${aws_api_gateway_resource._.id}"
  api_base_path   = "${aws_api_gateway_resource._.path_part}"

  cognito_identity_pool_provider = "${var.cognito_identity_pool_provider}"

  lambda_role_arn = "${aws_iam_role.lambda.arn}"
  lambda_filename = "${path.module}/lambda/dist.zip"

  
}

# module.register
module "register" {
  source = "./modules/register"

  namespace = "${var.namespace}"
  region    = "${var.region}"

  api_id          = "${aws_api_gateway_rest_api._.id}"
  api_resource_id = "${aws_api_gateway_resource._.id}"

  cognito_user_pool_id        = "${var.cognito_user_pool_id}"
  cognito_user_pool_client_id = "${var.cognito_user_pool_client_id}"

  dynamodb_table = "${aws_dynamodb_table._.name}"
  sns_topic_arn  = "${aws_sns_topic._.arn}"

  lambda_role_arn = "${aws_iam_role.lambda.arn}"
  lambda_filename = "${path.module}/lambda/dist.zip"

  zoho_id = var.zoho_id
  zoho_refresh_token = var.zoho_refresh_token
  zoho_secret = var.zoho_secret
  zoho_token = var.zoho_token
}

# module.reset
module "reset" {
  source = "./modules/reset"

  namespace = "${var.namespace}"
  region    = "${var.region}"

  api_id          = "${aws_api_gateway_rest_api._.id}"
  api_resource_id = "${aws_api_gateway_resource._.id}"

  cognito_user_pool_id        = "${var.cognito_user_pool_id}"
  cognito_user_pool_client_id = "${var.cognito_user_pool_client_id}"

  dynamodb_table = "${aws_dynamodb_table._.name}"
  sns_topic_arn  = "${aws_sns_topic._.arn}"

  lambda_role_arn = "${aws_iam_role.lambda.arn}"
  lambda_filename = "${path.module}/lambda/dist.zip"
}
