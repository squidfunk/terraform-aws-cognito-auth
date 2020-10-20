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

# data.template_file.cognito_iam_assume_role_policy.rendered
data "template_file" "cognito_iam_assume_role_policy" {
  template = file(
    "${path.module}/iam/policies/assume-role/cognito-identity.json"
  )

  vars = {
    cognito_identity_pool_id = aws_cognito_identity_pool._.id
  }
}

# -----------------------------------------------------------------------------

# data.template_file.lambda_iam_policy.rendered
data "template_file" "lambda_iam_policy" {
  template = file("${path.module}/iam/policies/lambda.json")

  vars = {
    cognito_user_pool_arn = aws_cognito_user_pool._.arn
  }
}

# -----------------------------------------------------------------------------
# Resources: IAM
# -----------------------------------------------------------------------------

# aws_iam_role.cognito
resource "aws_iam_role" "cognito" {
  name = "${var.namespace}-identity"

  assume_role_policy = data.template_file.cognito_iam_assume_role_policy.rendered
}

# -----------------------------------------------------------------------------

# aws_iam_role.lambda
resource "aws_iam_role" "lambda" {
  name = "${var.namespace}-identity-lambda"

  assume_role_policy = file(
    "${path.module}/iam/policies/assume-role/lambda.json"
  )
}

# aws_iam_policy.lambda
resource "aws_iam_policy" "lambda" {
  name = "${var.namespace}-identity-lambda"

  policy = data.template_file.lambda_iam_policy.rendered
}

# aws_iam_policy_attachment.lambda
resource "aws_iam_policy_attachment" "lambda" {
  name = "${var.namespace}-identity-lambda"

  policy_arn = aws_iam_policy.lambda.arn
  roles      = [aws_iam_role.lambda.name]
}

# -----------------------------------------------------------------------------
# Resource: Cognito
# -----------------------------------------------------------------------------

# aws_cognito_user_pool._
resource "aws_cognito_user_pool" "_" {
  name = var.namespace

  alias_attributes = [
    "email",
    "preferred_username",
  ]

  admin_create_user_config {
    allow_admin_create_user_only = false
  }

  password_policy {
    minimum_length    = 8
    require_uppercase = true
    require_lowercase = true
    require_numbers   = true
    require_symbols   = true
  }

  schema {
    name                = "email"
    attribute_data_type = "String"
    mutable             = false
    required            = true
  }

  lambda_config {
    pre_sign_up = aws_lambda_function._.arn
  }

  lifecycle {
    ignore_changes = [schema]
  }
}

# aws_cognito_user_pool_client._
resource "aws_cognito_user_pool_client" "_" {
  name = var.namespace

  user_pool_id    = aws_cognito_user_pool._.id
  generate_secret = false

  explicit_auth_flows = [
    "ADMIN_NO_SRP_AUTH",
    "USER_PASSWORD_AUTH",
  ]
}

# aws_cognito_identity_pool._
resource "aws_cognito_identity_pool" "_" {
  identity_pool_name      = var.cognito_identity_pool_name
  developer_provider_name = var.cognito_identity_pool_provider

  allow_unauthenticated_identities = false

  cognito_identity_providers {
    client_id               = aws_cognito_user_pool_client._.id
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
  identity_pool_id = aws_cognito_identity_pool._.id

  roles = {
    "authenticated" = aws_iam_role.cognito.arn
  }
}

# -----------------------------------------------------------------------------
# Resources: Lambda
# -----------------------------------------------------------------------------

# aws_lambda_function._
resource "aws_lambda_function" "_" {
  function_name = "${var.namespace}-identity-register"
  role          = aws_iam_role.lambda.arn
  runtime       = "nodejs12.x"
  filename      = "${path.module}/lambda/dist.zip"
  handler       = "index.handler"
  timeout       = 30
  memory_size   = 512

  source_code_hash = base64sha256(filebase64("${path.module}/lambda/dist.zip"))
}

# aws_lambda_permission._
resource "aws_lambda_permission" "_" {
  principal     = "cognito-idp.amazonaws.com"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function._.arn
  source_arn    = aws_cognito_user_pool._.arn
}
