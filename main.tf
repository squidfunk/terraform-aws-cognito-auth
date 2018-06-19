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
# Modules
# -----------------------------------------------------------------------------

# data.aws_caller_identity._
data "aws_caller_identity" "_" {}

# -----------------------------------------------------------------------------
# Modules
# -----------------------------------------------------------------------------

# module.api
module "api" {
  source = "./modules/api"

  namespace = "${var.namespace}"
  region    = "${var.region}"

  api_stage = "${var.api_stage}"

  cognito_user_pool        = "${module.identity.cognito_user_pool}"
  cognito_user_pool_arn    = "${module.identity.cognito_user_pool_arn}"
  cognito_user_pool_client = "${module.identity.cognito_user_pool_client}"
  cognito_identity_domain  = "${var.cognito_identity_domain}"
}

# module.identity
module "identity" {
  source = "./modules/identity"

  namespace = "${var.namespace}"
  region    = "${var.region}"

  cognito_identity_name   = "${var.cognito_identity_name}"
  cognito_identity_domain = "${var.cognito_identity_domain}"
}

# module.message
module "message" {
  source = "./modules/message"

  namespace = "${var.namespace}"
  region    = "${var.region}"

  cognito_user_pool       = "${module.identity.cognito_user_pool}"
  cognito_user_pool_arn   = "${module.identity.cognito_user_pool_arn}"
  cognito_identity_name   = "${var.cognito_identity_name}"
  cognito_identity_domain = "${var.cognito_identity_domain}"

  sns_topic_arn = "${module.api.sns_topic_arn}"

  ses_sender_address = "${var.ses_sender_address}"
}

# module.route
module "route" {
  source = "./modules/route"

  namespace = "${var.namespace}"
  region    = "${var.region}"

  cognito_identity_domain = "${var.cognito_identity_domain}"

  cloudfront_distribution_domain_name = "${
    module.web.cloudfront_distribution_domain_name
  }"

  cloudfront_distribution_hosted_zone_id = "${
    module.web.cloudfront_distribution_hosted_zone_id
  }"
}

# module.web
module "web" {
  source = "./modules/web"

  namespace = "${var.namespace}"
  region    = "${var.region}"

  api_id        = "${module.api.api_id}"
  api_stage     = "${module.api.api_stage}"
  api_base_path = "${module.api.api_base_path}"

  cognito_identity_domain = "${var.cognito_identity_domain}"
}
