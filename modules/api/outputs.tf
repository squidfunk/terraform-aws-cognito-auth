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
# Outputs: API Gateway
# -----------------------------------------------------------------------------

# output.api_id
output "api_id" {
  value = "${aws_api_gateway_rest_api._.id}"
}

# output.api_stage
output "api_stage" {
  value = "${aws_api_gateway_stage._.stage_name}"
}

# output.api_invoke_url
output "api_invoke_url" {
  value = "${aws_api_gateway_stage._.invoke_url}"
}

# output.api_base_path
output "api_base_path" {
  value = "${aws_api_gateway_resource._.path_part}"
}

# output.api_authorizer
output "api_authorizer" {
  value = "${aws_api_gateway_authorizer._.id}"
}

# -----------------------------------------------------------------------------
# Outputs: DynamoDB
# -----------------------------------------------------------------------------

# output.dynamodb_table
output "dynamodb_table" {
  value = "${aws_dynamodb_table._.name}"
}

# -----------------------------------------------------------------------------
# Outputs: SNS
# -----------------------------------------------------------------------------

# output.sns_topic_arn
output "sns_topic_arn" {
  value = "${aws_sns_topic._.arn}"
}
