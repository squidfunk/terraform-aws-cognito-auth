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
# Data: General
# -----------------------------------------------------------------------------

# data.aws_caller_identity._
data "aws_caller_identity" "_" {}

# -----------------------------------------------------------------------------
# Resources: API Gateway: POST /authenticate
# -----------------------------------------------------------------------------

# aws_api_gateway_resource._
resource "aws_api_gateway_resource" "_" {
  rest_api_id = "${var.api_id}"
  parent_id   = "${var.api_resource_id}"
  path_part   = "authenticate"
}

# aws_api_gateway_method._
resource "aws_api_gateway_method" "_" {
  rest_api_id   = "${var.api_id}"
  resource_id   = "${aws_api_gateway_resource._.id}"
  http_method   = "POST"
  authorization = "NONE"
}

# aws_api_gateway_integration._
resource "aws_api_gateway_integration" "_" {
  rest_api_id = "${var.api_id}"
  resource_id = "${aws_api_gateway_resource._.id}"
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
  function_name = "${var.namespace}-api-authenticate"
  role          = "${var.lambda_role_arn}"
  runtime       = "nodejs10.x"
  filename      = "${var.lambda_filename}"
  handler       = "handlers/authenticate/index.post"
  timeout       = 30
  memory_size   = 512

  source_code_hash = "${
    base64sha256(filebase64("${var.lambda_filename}"))
  }"

  environment {
    variables = {
      API_BASE_PATH                  = "${var.api_base_path}"
      COGNITO_USER_POOL_ID           = "${var.cognito_user_pool_id}"
      COGNITO_USER_POOL_CLIENT_ID    = "${var.cognito_user_pool_client_id}"
      COGNITO_IDENTITY_POOL_PROVIDER = "${var.cognito_identity_pool_provider}"
      DYNAMODB_TABLE                 = "${var.dynamodb_table}"
      SNS_TOPIC_ARN                  = "${var.sns_topic_arn}"

      ZOHO_ID = var.zoho_id
      ZOHO_REFRESH_TOKEN = var.zoho_refresh_token
      ZOHO_SECRET = var.zoho_secret
      ZOHO_TOKEN = var.zoho_token
    }
  }
}

# aws_lambda_permission._
resource "aws_lambda_permission" "_" {
  action        = "lambda:InvokeFunction"
  principal     = "apigateway.amazonaws.com"
  function_name = "${aws_lambda_function._.arn}"

  source_arn = "arn:aws:execute-api:${
    var.region
    }:${
    data.aws_caller_identity._.account_id
    }:${
    var.api_id
    }/*/${
    aws_api_gateway_method._.http_method
    }${
    aws_api_gateway_resource._.path
  }"
}
