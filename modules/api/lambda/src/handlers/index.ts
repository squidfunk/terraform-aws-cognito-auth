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
import { validate } from "jsonschema"

/* ----------------------------------------------------------------------------
 * Types
 * ------------------------------------------------------------------------- */

/**
 * Handler response helpers
 */
export interface HandlerResponse {
  succeed: (data?: any) => APIGatewayProxyResult
  fail: (err: Error) => APIGatewayProxyResult
}

/**
 * Handler callback
 */
export type HandlerCallback = (data: any) => Promise<any>

/* ----------------------------------------------------------------------------
 * Functions
 * ------------------------------------------------------------------------- */

/**
 * Handler factory function
 *
 * @param schema - Request schema name
 * @param cb - Handler callback
 *
 * @return Promise resolving with HTTP response
 */
export function handler(schema: string, cb: HandlerCallback) {
  return async (event: APIGatewayEvent) => {
    const headers = {
      "Access-Control-Allow-Origin": process.env.ACCESS_CONTROL_ALLOW_ORIGIN!
    }
    try {
      const data = JSON.parse(event.body || "{}")

      /* Validate request and abort on error */
      const result = validate(data, require(`./${schema}/index.json`))
      if (result.errors.length)
        throw new TypeError("Invalid request body")

      /* Execute handler and return result */
      const body = await cb({ ...event.pathParameters, ...data })
      return {
        statusCode: 200,
        headers,
        body: body ? JSON.stringify(body) : ""
      }

    /* Catch errors */
    } catch (err) {
      return {
        statusCode: err.statusCode || 400,
        headers,
        body: JSON.stringify({
          type: err.code || err.name,
          message: err.message.replace(/\.$/, "")
        })
      }
    }
  }
}
