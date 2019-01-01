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

import { RegisterRequest as Request } from "common"
import { post } from "handlers/register"

import {
  mockAuthenticationClientRegisterWithError,
  mockAuthenticationClientRegisterWithSuccess
} from "_/mocks/clients"
import { mockRegisterRequest } from "_/mocks/common/events/register"
import { mockAPIGatewayProxyEvent } from "_/mocks/vendor/aws-lambda"

/* ----------------------------------------------------------------------------
 * Tests
 * ------------------------------------------------------------------------- */

/* Registration */
describe("handlers/register", () => {

  /* POST /register */
  describe("post", () => {

    /* Credentials and event */
    const { email, password } = mockRegisterRequest()
    const event = mockAPIGatewayProxyEvent<Request>({
      body: { email, password }
    })

    /* Test: should resolve with empty body */
    it("should resolve with empty body", async () => {
      const registerMock = mockAuthenticationClientRegisterWithSuccess()
      const { statusCode, body } = await post(event)
      expect(statusCode).toEqual(204)
      expect(body).toEqual("")
      expect(registerMock)
        .toHaveBeenCalledWith(email, password)
    })

    /* Test: should resolve with password policy error */
    it("should resolve with password policy error", async () => {
      const registerMock = mockAuthenticationClientRegisterWithError()
      const { statusCode, body } = await post(
        mockAPIGatewayProxyEvent<Request>({
          body: { email, password: "" }
        }))
      expect(statusCode).toEqual(400)
      expect(body).toEqual(JSON.stringify({
        type: "Error",
        message:
          "Password must be at least 8 letters long, " +
          "contain a capital letter, " +
          "contain a lowercase letter, " +
          "contain a number, " +
          "and contain a special character"
      }))
      expect(registerMock).not.toHaveBeenCalled()
    })

    /* Test: should resolve with authentication client error */
    it("should resolve with authentication client error", async () => {
      const registerMock = mockAuthenticationClientRegisterWithError()
      const { statusCode, body } = await post(event)
      expect(statusCode).toEqual(400)
      expect(body).toEqual(JSON.stringify({
        type: "Error",
        message: "register"
      }))
      expect(registerMock)
        .toHaveBeenCalledWith(email, password)
    })
  })
})
