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

# provider.aws
provider "aws" {
  version = ">= 1.20.0, <= 2.0.0"
  alias   = "acm"
  region  = "us-east-1"
}

# -----------------------------------------------------------------------------
# Data: Certificate Manager
# -----------------------------------------------------------------------------

# data.aws_acm_certificate._
data "aws_acm_certificate" "_" {
  provider = "aws.acm"
  domain   = "${replace(var.cognito_identity_domain, "/^[^.]+./", "")}"
  statuses = ["ISSUED"]
}

# -----------------------------------------------------------------------------
# Data: S3
# -----------------------------------------------------------------------------

# data.template_file.s3_bucket_policy.rendered
data "template_file" "s3_bucket_policy" {
  template = "${file("${path.module}/iam/policies/s3.json")}"

  vars {
    bucket = "${var.cognito_identity_domain}"

    cloudfront_origin_access_identity_iam_arn = "${
      aws_cloudfront_origin_access_identity._.iam_arn
    }"
  }
}

# -----------------------------------------------------------------------------
# Resources: S3
# -----------------------------------------------------------------------------

# aws_s3_bucket._
resource "aws_s3_bucket" "_" {
  bucket = "${var.cognito_identity_domain}"
  acl    = "private"
  policy = "${data.template_file.s3_bucket_policy.rendered}"
}

# -----------------------------------------------------------------------------
# Resources: CloudFront
# -----------------------------------------------------------------------------

# aws_cloudfront_origin_access_identity._
resource "aws_cloudfront_origin_access_identity" "_" {}

# aws_cloudfront_distribution._
resource "aws_cloudfront_distribution" "_" {
  aliases         = ["${var.cognito_identity_domain}"]
  enabled         = true
  is_ipv6_enabled = true
  price_class     = "PriceClass_All"

  origin {
    domain_name = "${aws_s3_bucket._.bucket_domain_name}"

    origin_id = "web"

    s3_origin_config {
      origin_access_identity = "${
        aws_cloudfront_origin_access_identity._.cloudfront_access_identity_path
      }"
    }
  }

  origin {
    domain_name = "${var.api_id}.execute-api.${var.region}.amazonaws.com"

    origin_id   = "api"
    origin_path = "/${var.api_stage}"

    custom_origin_config {
      origin_protocol_policy = "https-only"

      origin_ssl_protocols = [
        "SSLv3",
        "TLSv1",
        "TLSv1.1",
        "TLSv1.2",
      ]

      http_port  = 80
      https_port = 443
    }
  }

  default_cache_behavior {
    target_origin_id = "web"

    allowed_methods = [
      "GET",
      "HEAD",
    ]

    cached_methods = [
      "GET",
      "HEAD",
    ]

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"

    compress    = true
    min_ttl     = 0
    default_ttl = 86400
    max_ttl     = 31536000
  }

  ordered_cache_behavior {
    target_origin_id = "api"
    path_pattern     = "/${var.api_base_path}/*"

    allowed_methods = [
      "DELETE",
      "GET",
      "HEAD",
      "OPTIONS",
      "PATCH",
      "POST",
      "PUT",
    ]

    cached_methods = [
      "GET",
      "HEAD",
    ]

    forwarded_values {
      query_string = true

      headers = [
        "Accept",
        "Authorization",
        "Content-Type",
        "Referer",
      ]

      cookies {
        forward           = "whitelist"
        whitelisted_names = ["__Secure-token"]
      }
    }

    viewer_protocol_policy = "redirect-to-https"

    compress    = true
    min_ttl     = 0
    default_ttl = 0
    max_ttl     = 0
  }

  default_root_object = "index.html"

  custom_error_response {
    error_code            = 403
    error_caching_min_ttl = 300
    response_code         = 200
    response_page_path    = "/index.html"
  }

  custom_error_response {
    error_code            = 404
    error_caching_min_ttl = 300
    response_code         = 200
    response_page_path    = "/index.html"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = false

    minimum_protocol_version = "TLSv1.1_2016"
    ssl_support_method       = "sni-only"
    acm_certificate_arn      = "${data.aws_acm_certificate._.arn}"
  }
}
