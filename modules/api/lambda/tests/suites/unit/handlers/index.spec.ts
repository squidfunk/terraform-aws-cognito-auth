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

import { AWSError } from "aws-sdk"

import { AuthenticateRequestWithCredentials as Request } from "common"
import { handler, translate } from "handlers"

import { chance } from "_/helpers"
import { mockAuthenticateRequestWithCredentials } from "_/mocks/common"
import {
  mockHandlerCallbackWithError,
  mockHandlerCallbackWithSuccess
} from "_/mocks/handlers"
import {
  mockAPIGatewayProxyEvent,
  mockAPIGatewayProxyEventPathParameters
} from "_/mocks/vendor/aws-lambda"
import {
  mockValidateWithError,
  mockValidateWithSuccess
} from "_/mocks/vendor/jsonschema"

/* ----------------------------------------------------------------------------
 * Tests
 * ------------------------------------------------------------------------- */

/* Lambda handlers */
describe("handlers", () => {

  /* Error translation */
  describe("translate", () => {

    /* Test: should translate user validation error */
    it("should translate user validation error", () => {
      const message = chance.string()
      expect(translate({
        code: "UserLambdaValidationException",
        message: `PreSignUp failed with error ${message}`
      } as AWSError))
        .toEqual({
          code: "AliasExistsException",
          message
        } as AWSError)
    })

    /* Test: should translate request parsing error */
    it("should translate request parsing error", () => {
      expect(translate({
        code: "SyntaxError",
        message: chance.string()
      } as AWSError))
        .toEqual({
          code: "TypeError",
          message: "Invalid request"
        } as AWSError)
    })

    /* Test: should pass-through all other errors */
    it("should pass-through all other errors", () => {
      const message = chance.string()
      const err = { code: chance.string(), message } as AWSError
      expect(translate(err)).toBe(err)
    })
  })

  /* Handler factory */
  describe("handler", () => {

    /* Test: should resolve with callback response body */
    it("should resolve with callback response body", async () => {
      const event = mockAPIGatewayProxyEvent()
      mockValidateWithSuccess()
      const result = chance.string()
      const cb = mockHandlerCallbackWithSuccess(result)
      const { statusCode, body } = await handler({}, cb)(event)
      expect(statusCode).toEqual(200)
      expect(body).toEqual(JSON.stringify(result))
    })

    /* Test: should resolve with callback response headers */
    it("should resolve with callback response headers", async () => {
      const event = mockAPIGatewayProxyEvent()
      mockValidateWithSuccess()
      const result = { [chance.string()]: chance.string() }
      const cb = mockHandlerCallbackWithSuccess(undefined, result)
      const { statusCode, headers } = await handler({}, cb)(event)
      expect(statusCode).toEqual(204)
      expect(headers).toEqual(result)
    })

    /* Test: should resolve with error for malformed request */
    it("should resolve with error for malformed request", async () => {
      const event = mockAPIGatewayProxyEvent({ body: "/" })
      mockValidateWithSuccess()
      const cb = mockHandlerCallbackWithSuccess()
      const { statusCode, body } = await handler({}, cb)(event)
      expect(statusCode).toEqual(400)
      expect(body).toEqual(JSON.stringify({
        type: "TypeError",
        message: "Invalid request"
      }))
    })

    /* Test: should resolve with error for invalid request */
    it("should resolve with error for invalid request", async () => {
      const event = mockAPIGatewayProxyEvent()
      mockValidateWithError()
      const cb = mockHandlerCallbackWithSuccess()
      const { statusCode, body } = await handler({}, cb)(event)
      expect(statusCode).toEqual(400)
      expect(body).toEqual(JSON.stringify({
        type: "TypeError",
        message: "Invalid request"
      }))
      expect(cb).not.toHaveBeenCalled()
    })

    /* Test: should resolve with error for internal error */
    it("should resolve with error for internal error", async () => {
      const event = mockAPIGatewayProxyEvent()
      mockValidateWithSuccess()
      const cb = mockHandlerCallbackWithError()
      const { statusCode, body } = await handler({}, cb)(event)
      expect(statusCode).toEqual(400)
      expect(body).toEqual(JSON.stringify({
        type: "Error",
        message: "callback"
      }))
      expect(cb).toHaveBeenCalled()
    })

    /* Test: should invoke callback with path parameters */
    it("should invoke callback with path parameters", async () => {
      const pathParameters = mockAPIGatewayProxyEventPathParameters()
      const event = mockAPIGatewayProxyEvent({ pathParameters })
      mockValidateWithSuccess()
      const cb = mockHandlerCallbackWithSuccess()
      await handler({}, cb)(event)
      expect(cb).toHaveBeenCalledWith(
        jasmine.objectContaining({ pathParameters }))
    })

    /* Test: should invoke callback with request body */
    it("should invoke callback with request body", async () => {
      const body = mockAuthenticateRequestWithCredentials()
      const event = mockAPIGatewayProxyEvent<Request>({ body })
      mockValidateWithSuccess()
      const cb = mockHandlerCallbackWithSuccess()
      await handler({}, cb)(event)
      expect(cb).toHaveBeenCalledWith(jasmine.objectContaining({ body }))
    })

    /* Test: should handle empty request body */
    it("should handle empty request body", async () => {
      const event = mockAPIGatewayProxyEvent({ method: "GET" })
      mockValidateWithSuccess()
      const cb = mockHandlerCallbackWithSuccess()
      const { statusCode } = await handler({}, cb)(event)
      expect(statusCode).toEqual(204)
    })
  })
})
