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
# Variables: General
# -----------------------------------------------------------------------------

# var.namespace
variable "namespace" {
  description = "AWS resource namespace/prefix"
}

# var.region
variable "region" {
  description = "AWS region"
}

# -----------------------------------------------------------------------------
# Variables: API Gateway
# -----------------------------------------------------------------------------

# var.api_stage
variable "api_stage" {
  description = "API deployment stage"
}

# -----------------------------------------------------------------------------
# Variables: Cognito
# -----------------------------------------------------------------------------

# var.cognito_user_pool_id
variable "cognito_user_pool_id" {
  description = "Cognito user pool identifier"
}

# var.cognito_user_pool_arn
variable "cognito_user_pool_arn" {
  description = "Cognito user pool ARN"
}

# var.cognito_user_pool_client_id
variable "cognito_user_pool_client_id" {
  description = "Cognito user pool client identifier"
}

# var.cognito_identity_pool_provider
variable "cognito_identity_pool_provider" {
  description = "Cognito identity pool provider"
}

variable "zoho_id" {
  description = "Zoho account id"
}

variable "zoho_refresh_token" {
  description = "Zoho refresh token"
}

variable "zoho_secret" {
  description = "Zoho secret"
}

variable "zoho_token" {
  description = "Zoho token"
}