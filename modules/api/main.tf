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
# Data: IAM
# -----------------------------------------------------------------------------

# data.template_file.lambda_iam_policy.rendered
data "template_file" "lambda_iam_policy" {
  template = "${file("${path.module}/iam/policies/lambda.json")}"

  vars {
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
      sha256(file("${path.module}/lambda/dist.zip"))
    }"
  }

  lifecycle {
    create_before_destroy = true
  }

  depends_on = [
    "module.authenticate",
    "module.check",
    "module.register",
    "module.reset",
  ]
}

# aws_api_gateway_authorizer._
resource "aws_api_gateway_authorizer" "_" {
  rest_api_id = "${aws_api_gateway_rest_api._.id}"

  name = "${var.namespace}"
  type = "COGNITO_USER_POOLS"

  provider_arns = [
    "${var.cognito_user_pool_arn}",
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

  cognito_user_pool        = "${var.cognito_user_pool}"
  cognito_user_pool_client = "${var.cognito_user_pool_client}"
  cognito_identity_domain  = "${var.cognito_identity_domain}"

  dynamodb_table = "${aws_dynamodb_table._.name}"
  sns_topic_arn  = "${aws_sns_topic._.arn}"

  lambda_role_arn = "${aws_iam_role.lambda.arn}"
  lambda_filename = "${path.module}/lambda/dist.zip"
}

# -----------------------------------------------------------------------------

# module.check
module "check" {
  source = "./modules/check"

  namespace = "${var.namespace}"
  region    = "${var.region}"

  api_id            = "${aws_api_gateway_rest_api._.id}"
  api_resource_id   = "${aws_api_gateway_resource._.id}"
  api_authorizer_id = "${aws_api_gateway_authorizer._.id}"
}

# -----------------------------------------------------------------------------

# module.register
module "register" {
  source = "./modules/register"

  namespace = "${var.namespace}"
  region    = "${var.region}"

  api_id          = "${aws_api_gateway_rest_api._.id}"
  api_resource_id = "${aws_api_gateway_resource._.id}"

  cognito_user_pool        = "${var.cognito_user_pool}"
  cognito_user_pool_client = "${var.cognito_user_pool_client}"

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
  api_resource_id = "${aws_api_gateway_resource._.id}"

  cognito_user_pool        = "${var.cognito_user_pool}"
  cognito_user_pool_client = "${var.cognito_user_pool_client}"

  dynamodb_table = "${aws_dynamodb_table._.name}"
  sns_topic_arn  = "${aws_sns_topic._.arn}"

  lambda_role_arn = "${aws_iam_role.lambda.arn}"
  lambda_filename = "${path.module}/lambda/dist.zip"
}
