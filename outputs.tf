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
# Providers
# -----------------------------------------------------------------------------

# output.aws_account_id
output "aws_account_id" {
  value = "${data.aws_caller_identity._.account_id}"
}

# output.aws_region
output "aws_region" {
  value = "${var.region}"
}

# -----------------------------------------------------------------------------
# Outputs: API Gateway
# -----------------------------------------------------------------------------

# output.api_id
output "api_id" {
  value = "${module.api.api_id}"
}

# output.api_stage
output "api_stage" {
  value = "${module.api.api_stage}"
}

# output.api_invoke_url
output "api_invoke_url" {
  value = "${module.api.api_invoke_url}"
}

# output.api_authorizer
output "api_authorizer" {
  value = "${module.api.api_authorizer}"
}

# -----------------------------------------------------------------------------
# Outputs: Cognito
# -----------------------------------------------------------------------------

# output.cognito_user_pool
output "cognito_user_pool" {
  value = "${module.identity.cognito_user_pool}"
}

# output.cognito_user_pool_arn
output "cognito_user_pool_arn" {
  value = "${module.identity.cognito_user_pool_arn}"
}

# output.cognito_user_pool_client
output "cognito_user_pool_client" {
  value = "${module.identity.cognito_user_pool_client}"
}

# output.cognito_identity_pool
output "cognito_identity_pool" {
  value = "${module.identity.cognito_identity_pool}"
}

# output.cognito_identity_name
output "cognito_identity_name" {
  value = "${var.cognito_identity_name}"
}

# output.cognito_identity_domain
output "cognito_identity_domain" {
  value = "${var.cognito_identity_domain}"
}

# -----------------------------------------------------------------------------
# Outputs: DynamoDB
# -----------------------------------------------------------------------------

# output.dynamodb_table
output "dynamodb_table" {
  value = "${module.api.dynamodb_table}"
}

# -----------------------------------------------------------------------------
# Outputs: SNS
# -----------------------------------------------------------------------------

# output.sns_topic_arn
output "sns_topic_arn" {
  value = "${module.api.sns_topic_arn}"
}
