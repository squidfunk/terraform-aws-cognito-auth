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

import { post } from "handlers/reset"

import {
  ResetRequest as Request
} from "common/events/reset"

import {
  mockAuthenticationClientForgotPasswordWithError,
  mockAuthenticationClientForgotPasswordWithSuccess
} from "_/mocks/clients/authentication"
import { mockResetRequest } from "_/mocks/common/events/reset"
import { mockAPIGatewayProxyEvent } from "_/mocks/vendor/aws-lambda"

/* ----------------------------------------------------------------------------
 * Tests
 * ------------------------------------------------------------------------- */

/* Reset */
describe("handlers/reset", () => {

  /* POST /reset */
  describe("post", () => {

    /* Reset request */
    const { username } = mockResetRequest()

    /* API Gateway event */
    const event = mockAPIGatewayProxyEvent<Request>({ body: { username } })

    /* Test: should resolve with empty body */
    it("should resolve with empty body", async () => {
      const forgotPasswordMock =
        mockAuthenticationClientForgotPasswordWithSuccess()
      const { statusCode, body } = await post(event)
      expect(statusCode).toEqual(200)
      expect(body).toEqual("{}")
      expect(forgotPasswordMock)
        .toHaveBeenCalledWith(username)
    })

    /* Test: should resolve with authentication client error */
    it("should resolve with authentication client error", async () => {
      const forgotPasswordMock =
        mockAuthenticationClientForgotPasswordWithError()
      const { statusCode, body } = await post(event)
      expect(statusCode).toEqual(400)
      expect(body).toEqual(JSON.stringify({
        type: "Error",
        message: "forgotPassword"
      }))
      expect(forgotPasswordMock)
        .toHaveBeenCalledWith(username)
    })
  })
})
