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
  APIGatewayProxyEvent,
  APIGatewayProxyResult
} from "aws-lambda"
import { AWSError } from "aws-sdk"
import { validate } from "jsonschema"

/* ----------------------------------------------------------------------------
 * Types
 * ------------------------------------------------------------------------- */

/**
 * Handler callback event
 *
 * @template P - Callback event path parameter type
 * @template B - Callback event body type
 */
export interface HandlerCallbackEvent<P extends {}, B extends {}> {
  path: string                         /* Event path */
  pathParameters: P                    /* Event path parameters */
  headers: {                           /* Event headers */
    [name: string]: string
  }
  body: B                              /* Event body */
}

/**
 * Handler callback response
 *
 * @template T - Callback response body type
 */
export interface HandlerCallbackResponse<T> {
  headers?: {                          /* Response headers */
    [name: string]: string
  }
  body?: T                             /* Response body */
}

/**
 * Handler callback
 *
 * @template P - Callback event path parameter type
 * @template B - Callback event body type
 * @template T - Callback response body type
 */
export type HandlerCallback<P extends {}, B extends {}, T = void> =
  (event: HandlerCallbackEvent<P, B>) =>
    Promise<HandlerCallbackResponse<T> | void>

/* ----------------------------------------------------------------------------
 * Functions
 * ------------------------------------------------------------------------- */

/**
 * Translate/map error code and message for some errors
 *
 * @param err - Error
 *
 * @return Mapped error
 */
export function translate(err: AWSError): AWSError {
  switch (err.code) {

    /* JSON parsing failed */
    case "SyntaxError":
      err.code    = "TypeError"
      err.message = "Invalid request"
      return err

    /* Pre-registration check failed */
    case "UserLambdaValidationException":
      err.code    = "AliasExistsException"
      err.message = err.message.replace("PreSignUp failed with error ", "")
      return err

    /* Pass-through all other errors */
    default:
      return err
  }
}

/**
 * Handler factory function
 *
 * @template P - Callback event path parameter type
 * @template B - Callback event body type
 * @template T - Callback response body type
 *
 * @param schema - Request schema
 * @param cb - Handler callback
 *
 * @return Promise resolving with HTTP response
 */
export function handler<P extends {}, B extends {}, T = void>(
  schema: object, cb: HandlerCallback<P, B, T>
) {
  return async (event: APIGatewayProxyEvent):
      Promise<APIGatewayProxyResult> => {
    try {
      const data: B = event.httpMethod === "POST"
        ? JSON.parse(event.body || "{}")
        : {}

      /* Validate request and abort on error */
      const result = validate(data, schema)
      if (!result.valid)
        throw new TypeError("Invalid request")

      /* Execute handler and return response */
      const { body, headers } = {
        body: undefined,
        headers: {},
        ...(await cb({
          path: event.path,
          pathParameters: event.pathParameters as P,
          headers: event.headers,
          body: data
        }))
      }
      return {
        statusCode: 200,
        headers,
        body: body ? JSON.stringify(body) : "{}"
      }

    /* Catch errors */
    } catch (err) {
      err.code = err.code || err.name
      err = translate(err)
      return {
        statusCode: err.statusCode || 400,
        body: JSON.stringify({
          type: err.code,
          message: err.message.replace(/\.$/, "")
        })
      }
    }
  }
}
