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

import { AWSError } from "aws-sdk"

import { handler, translate } from "~/handlers"

import { chance } from "_/helpers"
import {
  mockHandlerCallbackWithError,
  mockHandlerCallbackWithSuccess
} from "_/mocks/handlers"
import {
  mockAuthenticateRequestWithCredentials
} from "_/mocks/handlers/authenticate"
import {
  mockAPIGatewayEvent,
  mockAPIGatewayEventPathParameters
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

    /* Test: should convert lambda validation errors */
    it("should convert lambda validation errors", () => {
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

    /* Test: should pass-through all other errors */
    it("should pass-through all other errors", () => {
      const message = chance.string()
      const err = { code: chance.string(), message } as AWSError
      expect(translate(err)).toBe(err)
    })
  })

  /* Handler factory */
  describe("handler", () => {

    /* Test: should resolve with callback result */
    it("should resolve with callback result", async () => {
      const event = mockAPIGatewayEvent("POST")
      mockValidateWithSuccess()
      const result = chance.string()
      const cb = mockHandlerCallbackWithSuccess(result)
      const { statusCode, body } = await handler("authenticate", cb)(event)
      expect(statusCode).toEqual(200)
      expect(JSON.parse(body)).toEqual(result)
    })

    /* Test: should resolve with error for malformed request */
    it("should resolve with error for malformed request", async () => {
      const event = mockAPIGatewayEvent("POST", "/", {})
      mockValidateWithSuccess()
      const cb = mockHandlerCallbackWithSuccess()
      const { statusCode, body } = await handler("authenticate", cb)(event)
      expect(statusCode).toEqual(400)
      expect(JSON.parse(body)).toEqual({
        type: "SyntaxError",
        message: "Unexpected token / in JSON at position 0"
      })
    })

    /* Test: should resolve with error for invalid request */
    it("should resolve with error for invalid request", async () => {
      const event = mockAPIGatewayEvent("POST")
      mockValidateWithError()
      const cb = mockHandlerCallbackWithSuccess()
      const { statusCode, body } = await handler("authenticate", cb)(event)
      expect(statusCode).toEqual(400)
      expect(JSON.parse(body)).toEqual({
        type: "TypeError",
        message: "Invalid request body"
      })
      expect(cb)
        .not.toHaveBeenCalledWith()
    })

    /* Test: should resolve with error for internal error */
    it("should resolve with error for internal error", async () => {
      const event = mockAPIGatewayEvent("POST")
      mockValidateWithSuccess()
      const cb = mockHandlerCallbackWithError()
      const { statusCode, body } = await handler("authenticate", cb)(event)
      expect(statusCode).toEqual(400)
      expect(JSON.parse(body)).toEqual({
        type: "Error",
        message: "mockHandlerCallbackWithError"
      })
      expect(cb)
        .toHaveBeenCalled()
    })

    /* Test: should invoke callback with path parameters */
    it("should invoke callback with path parameters", async () => {
      const params = mockAPIGatewayEventPathParameters()
      const event = mockAPIGatewayEvent("POST", undefined, params)
      mockValidateWithSuccess()
      const cb = mockHandlerCallbackWithSuccess()
      await handler("authenticate", cb)(event)
      expect(cb)
        .toHaveBeenCalledWith(params)
    })

    /* Test: should invoke callback with request payload */
    it("should invoke callback with request payload", async () => {
      const data = mockAuthenticateRequestWithCredentials()
      const event = mockAPIGatewayEvent("POST", data, {})
      mockValidateWithSuccess()
      const cb = mockHandlerCallbackWithSuccess()
      await handler("authenticate", cb)(event)
      expect(cb)
        .toHaveBeenCalledWith(data)
    })

    /* Test: should set necessary cross-origin headers */
    it("should set necessary cross-origin headers", async () => {
      const event = mockAPIGatewayEvent("GET")
      mockValidateWithSuccess()
      const { headers, statusCode } =
        await handler("authenticate", mockHandlerCallbackWithSuccess())(event)
      expect(statusCode).toEqual(200)
      expect(headers).toEqual({
        "Access-Control-Allow-Origin": process.env.COGNITO_IDENTITY_DOMAIN!
      } as any)
    })

    /* Test: should set necessary cross-origin headers on error */
    it("should set necessary cross-origin headers on error", async () => {
      const event = mockAPIGatewayEvent("GET")
      mockValidateWithSuccess()
      const { headers, statusCode } =
        await handler("authenticate", mockHandlerCallbackWithError())(event)
      expect(statusCode).toEqual(400)
      expect(headers).toEqual({
        "Access-Control-Allow-Origin": process.env.COGNITO_IDENTITY_DOMAIN!
      } as any)
    })
  })
})
