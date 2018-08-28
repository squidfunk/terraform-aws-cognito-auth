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
# Local variables
# -----------------------------------------------------------------------------

# local.*
locals {
  enabled = "${length(var.app_domain) == 0 ? 0 : 1}"
}

# -----------------------------------------------------------------------------
# Resources: Route 53
# -----------------------------------------------------------------------------

# aws_route53_record._
resource "aws_route53_record" "_" {
  count   = "${local.enabled}"
  zone_id = "${var.app_hosted_zone_id}"
  name    = "${var.app_domain}"
  type    = "A"

  alias {
    zone_id = "${var.cloudfront_distribution_hosted_zone_id}"
    name    = "${var.cloudfront_distribution_domain_name}"

    evaluate_target_health = false
  }
}
