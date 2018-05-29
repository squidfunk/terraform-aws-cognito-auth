/*
 * Copyright (c) 2018 Martin Donath <martin.donath@squidfunk.com>
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
  APIGatewayEvent,
  APIGatewayProxyResult
} from "aws-lambda"

/* ----------------------------------------------------------------------------
 * Handlers
 * ------------------------------------------------------------------------- */

/**
 * Deliver incoming event to Kinesis
 *
 * @param event - API Gateway event
 *
 * @return Promise resolving with HTTP response
 */
export async function handler(
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> {
  console.log(event)

  /* Always return with 202 (Accepted) and add CORS headers, as we use the
     Lambda Proxy integration which doesn't add them upon invocation */
  return {
    statusCode: 202,
    headers: {
      "Access-Control-Allow-Origin": process.env.ACCESS_CONTROL_ORIGIN!
    },
    body: ""
  }
}

export const authenticate = handler
export const register = handler
export const register_verify = handler // tslint:disable-line variable-name
export const reset = handler
export const reset_verify = handler // tslint:disable-line variable-name
