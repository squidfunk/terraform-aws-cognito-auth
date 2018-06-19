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
# Locals
# -----------------------------------------------------------------------------

# local.*
locals {
  enabled = "${length(var.ses_sender_address) == 0 ? 0 : 1}"
}

# -----------------------------------------------------------------------------
# Data: IAM
# -----------------------------------------------------------------------------

# data.template_file.lambda_iam_policy.rendered
data "template_file" "lambda_iam_policy" {
  template = "${file("${path.module}/iam/policies/lambda.json")}"

  vars {
    cognito_user_pool_arn = "${var.cognito_user_pool_arn}"
  }
}

# -----------------------------------------------------------------------------
# Resources: IAM
# -----------------------------------------------------------------------------

# aws_iam_role.lambda
resource "aws_iam_role" "lambda" {
  count = "${local.enabled}"

  name = "${var.namespace}-message-lambda"

  assume_role_policy = "${
    file("${path.module}/iam/policies/assume-role/lambda.json")
  }"
}

# aws_iam_policy.lambda
resource "aws_iam_policy" "lambda" {
  count = "${local.enabled}"

  name = "${var.namespace}-message-lambda"

  policy = "${data.template_file.lambda_iam_policy.rendered}"
}

# aws_iam_policy_attachment.lambda
resource "aws_iam_policy_attachment" "lambda" {
  count = "${local.enabled}"

  name = "${var.namespace}-message-lambda"

  policy_arn = "${aws_iam_policy.lambda.arn}"
  roles      = ["${aws_iam_role.lambda.name}"]
}

# -----------------------------------------------------------------------------
# Resources: SNS
# -----------------------------------------------------------------------------

# aws_sns_topic_subscription._
resource "aws_sns_topic_subscription" "_" {
  count = "${local.enabled}"

  topic_arn = "${var.sns_topic_arn}"
  protocol  = "lambda"
  endpoint  = "${aws_lambda_function._.arn}"
}

# -----------------------------------------------------------------------------
# Resources: Lambda
# -----------------------------------------------------------------------------

# aws_lambda_function._
resource "aws_lambda_function" "_" {
  count = "${local.enabled}"

  function_name = "${var.namespace}-message"
  role          = "${aws_iam_role.lambda.arn}"
  runtime       = "nodejs8.10"
  filename      = "${path.module}/lambda/dist.zip"
  handler       = "index.handler"
  timeout       = 10

  source_code_hash = "${
    base64sha256(file("${path.module}/lambda/dist.zip"))
  }"

  environment {
    variables = {
      COGNITO_USER_POOL       = "${var.cognito_user_pool}"
      COGNITO_IDENTITY_NAME   = "${var.cognito_identity_name}"
      COGNITO_IDENTITY_DOMAIN = "${var.cognito_identity_domain}"
      SES_SENDER_ADDRESS      = "${var.ses_sender_address}"
    }
  }
}

# aws_lambda_permission._
resource "aws_lambda_permission" "_" {
  count = "${local.enabled}"

  principal     = "sns.amazonaws.com"
  action        = "lambda:InvokeFunction"
  function_name = "${aws_lambda_function._.arn}"
  source_arn    = "${var.sns_topic_arn}"
}
