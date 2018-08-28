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

provider "aws" {
  version = ">= 1.20.0, <= 2.0.0"
  alias   = "lambda"
  region  = "us-east-1"
}

# -----------------------------------------------------------------------------
# Local variables
# -----------------------------------------------------------------------------

# local.*
locals {
  enabled = "${length(var.app_domain) == 0 ? 0 : 1}"
}

# -----------------------------------------------------------------------------
# Data: Distribution files
# -----------------------------------------------------------------------------

# data.external.dist
data "external" "dist" {
  count   = "${local.enabled}"
  program = ["${path.module}/s3/scripts/trigger.sh"]

  query {
    directory = "${path.module}/app/dist"
  }
}

# -----------------------------------------------------------------------------
# Data: S3
# -----------------------------------------------------------------------------

# data.template_file.s3_bucket_policy.rendered
data "template_file" "s3_bucket_policy" {
  count    = "${local.enabled}"
  template = "${file("${path.module}/s3/bucket/policy.json")}"

  vars {
    bucket = "${var.namespace}"

    cloudfront_origin_access_identity_iam_arn = "${
      aws_cloudfront_origin_access_identity._.iam_arn
    }"
  }
}

# -----------------------------------------------------------------------------

# data.template_file.index.rendered
data "template_file" "index" {
  count    = "${local.enabled}"
  template = "${file("${path.module}/app/dist/index.html")}"

  vars {
    api_base_path              = "${var.api_base_path}"
    app_origin                 = "${var.app_origin}"
    cognito_identity_pool_name = "${var.cognito_identity_pool_name}"
  }
}

# -----------------------------------------------------------------------------
# Resources: IAM
# -----------------------------------------------------------------------------

# aws_iam_role.lambda
resource "aws_iam_role" "lambda" {
  count = "${local.enabled}"
  name  = "${var.namespace}-web-lambda"

  assume_role_policy = "${
    file("${path.module}/iam/policies/assume-role/lambda.json")
  }"
}

# aws_iam_policy.lambda
resource "aws_iam_policy" "lambda" {
  count = "${local.enabled}"
  name  = "${var.namespace}-web-lambda"

  policy = "${file("${path.module}/iam/policies/lambda.json")}"
}

# aws_iam_policy_attachment.lambda
resource "aws_iam_policy_attachment" "lambda" {
  count = "${local.enabled}"
  name  = "${var.namespace}-web-lambda"

  policy_arn = "${aws_iam_policy.lambda.arn}"
  roles      = ["${aws_iam_role.lambda.name}"]
}

# -----------------------------------------------------------------------------
# Resources: Distribution files
# -----------------------------------------------------------------------------

# null_resource.dist
resource "null_resource" "dist" {
  count = "${local.enabled}"

  triggers {
    md5 = "${data.external.dist.result["checksum"]}"
  }

  # Sync whole directory to S3
  provisioner "local-exec" {
    command = "${path.module}/s3/scripts/sync.sh"

    environment {
      DIRECTORY = "${path.module}/app/dist"
      BUCKET    = "${aws_s3_bucket._.bucket}"
    }
  }
}

# -----------------------------------------------------------------------------
# Resources: S3
# -----------------------------------------------------------------------------

# aws_s3_bucket._
resource "aws_s3_bucket" "_" {
  count  = "${local.enabled}"
  bucket = "${var.namespace}"
  acl    = "private"
  policy = "${data.template_file.s3_bucket_policy.rendered}"
}

# aws_s3_bucket_object.index
resource "aws_s3_bucket_object" "index" {
  count         = "${local.enabled}"
  bucket        = "${aws_s3_bucket._.bucket}"
  key           = "index.html"
  content       = "${data.template_file.index.rendered}"
  acl           = "private"
  cache_control = "public, max-age=0, must-revalidate"
  content_type  = "text/html"
}

# -----------------------------------------------------------------------------
# Resources: CloudFront
# -----------------------------------------------------------------------------

# aws_cloudfront_origin_access_identity._
resource "aws_cloudfront_origin_access_identity" "_" {
  count = "${local.enabled}"
}

# aws_cloudfront_distribution._
resource "aws_cloudfront_distribution" "_" {
  count           = "${local.enabled}"
  aliases         = ["${var.app_domain}"]
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

    lambda_function_association {
      event_type = "origin-response"
      lambda_arn = "${aws_lambda_function._.qualified_arn}"
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
    acm_certificate_arn      = "${var.app_certificate_arn}"
  }
}

# -----------------------------------------------------------------------------
# Resources: Lambda
# -----------------------------------------------------------------------------

# aws_lambda_function._
resource "aws_lambda_function" "_" {
  count         = "${local.enabled}"
  function_name = "${var.namespace}-web-security"
  role          = "${aws_iam_role.lambda.arn}"
  runtime       = "nodejs8.10"
  filename      = "${path.module}/lambda/dist.zip"
  handler       = "index.handler"
  timeout       = 30
  memory_size   = 512

  source_code_hash = "${
    base64sha256(file("${path.module}/lambda/dist.zip"))
  }"

  # Lambda@Edge function must be located in us-east-1
  provider = "aws.lambda"
  publish  = true
}

# aws_lambda_permission._
resource "aws_lambda_permission" "_" {
  count         = "${local.enabled}"
  principal     = "cloudfront.amazonaws.com"
  action        = "lambda:InvokeFunction"
  function_name = "${aws_lambda_function._.arn}"
  source_arn    = "${aws_cloudfront_distribution._.arn}"

  # Lambda@Edge function must be located in us-east-1
  provider = "aws.lambda"
}
