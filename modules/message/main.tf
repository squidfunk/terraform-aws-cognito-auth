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
# Resources: IAM
# -----------------------------------------------------------------------------

# aws_iam_role.lambda
resource "aws_iam_role" "lambda" {
  name = "${var.namespace}-message-lambda"

  assume_role_policy = "${
    file("${path.module}/iam/policies/assume-role/lambda.json")
  }"
}

# aws_iam_policy.lambda
resource "aws_iam_policy" "lambda" {
  name = "${var.namespace}-message-lambda"

  policy = "${file("${path.module}/iam/policies/lambda.json")}"
}

# aws_iam_policy_attachment.lambda
resource "aws_iam_policy_attachment" "lambda" {
  name = "${var.namespace}-message-lambda"

  policy_arn = "${aws_iam_policy.lambda.arn}"
  roles      = ["${aws_iam_role.lambda.name}"]
}

# -----------------------------------------------------------------------------
# Resources: Lambda
# -----------------------------------------------------------------------------

# aws_lambda_function._
resource "aws_lambda_function" "_" {
  function_name = "${var.namespace}-message"
  role          = "${aws_iam_role.lambda.arn}"
  runtime       = "nodejs8.10"
  filename      = "${path.module}/lambda/dist.zip"
  handler       = "index.send"
  timeout       = 10

  source_code_hash = "${
    base64sha256(file("${path.module}/lambda/dist.zip"))
  }"
}

# aws_lambda_permission._
resource "aws_lambda_permission" "_" {
  principal     = "sns.amazonaws.com"
  action        = "lambda:InvokeFunction"
  function_name = "${aws_lambda_function._.arn}"
  source_arn    = "${var.sns_topic_arn}"
}
