/*
 * Copyright (c) 2018-2019 Martin Donath <martin.donath@squidfunk.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NON-INFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 */

import {
  CloudFrontResponse,
  CloudFrontResponseEvent
} from "aws-lambda"

/* ----------------------------------------------------------------------------
 * Handlers
 * ------------------------------------------------------------------------- */

/**
 * Add security headers to CloudFront response
 *
 * See https://mzl.la/2MzwYIH for a full explanation of all security headers
 *
 * @param event - CloudFront origin response event
 *
 * @return Promise resolving with modified response
 */
export async function handler(
  event: CloudFrontResponseEvent
): Promise<CloudFrontResponse> {
  const response = event.Records[0].cf.response

  /* Define security headers */
  const headers = {

    /* Block all external and inline resources except CSS (needed by JSS) */
    "Content-Security-Policy": [
      "default-src 'self'",
      "style-src 'self' 'unsafe-inline'"
    ].join("; "),

    /* Clients may only connect via HTTPS */
    "Strict-Transport-Security": [
      "max-age=31536000",
      "includeSubdomains",
      "preload"
    ].join("; "),

    /* Client should never send its referrer */
    "Referrer-Policy": "no-referrer",

    /* Client should never sniff MIME type of files */
    "X-Content-Type-Options": "nosniff",

    /* Site may not be loaded inside an iframe */
    "X-Frame-Options": "DENY",

    /* Site will stop loading if XSS is attempted */
    "X-XSS-Protection": [
      "1",
      "mode=block"
    ].join("; ")
  }

  /* Add security headers and return modified response */
  Object.keys(headers).forEach(key => {
    response.headers[key] = [
      {
        key,
        value: headers[key as keyof typeof headers]
      }
    ]
  })
  return response
}
