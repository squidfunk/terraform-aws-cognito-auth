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

import { post } from "~/handlers/authenticate"

import {
  mockAuthenticationClientAuthenticateWithError,
  mockAuthenticationClientAuthenticateWithResult,
  mockSession
} from "_/mocks/clients/authentication"
import {
  mockAuthenticateRequestWithCredentials,
  mockAuthenticateRequestWithToken
} from "_/mocks/handlers/authenticate"
import { mockAPIGatewayEventHttpPost } from "_/mocks/vendor/aws-lambda"

/* ----------------------------------------------------------------------------
 * Tests
 * ------------------------------------------------------------------------- */

/* Authentication */
describe("handlers/authenticate", () => {

  /* POST /authenticate */
  describe("post", () => {

    /* Credentials, token and session */
    const { username, password } = mockAuthenticateRequestWithCredentials()
    const { token } = mockAuthenticateRequestWithToken()
    const session = mockSession()

    /* Test: should resolve with session for valid credentials */
    it("should resolve with session for valid credentials", async () => {
      const event = mockAPIGatewayEventHttpPost({ username, password })
      const authenticateMock =
        mockAuthenticationClientAuthenticateWithResult(session)
      const { statusCode, body } = await post(event)
      expect(statusCode).toEqual(200)
      expect(body).toEqual(JSON.stringify(session))
      expect(authenticateMock)
        .toHaveBeenCalledWith(username, password)
    })

    /* Test: should resolve with session for valid refresh token */
    it("should resolve with session for valid refresh token", async () => {
      const event = mockAPIGatewayEventHttpPost({ token })
      const authenticateMock =
        mockAuthenticationClientAuthenticateWithResult(session)
      const { statusCode, body } = await post(event)
      expect(statusCode).toEqual(200)
      expect(body).toEqual(JSON.stringify(session))
      expect(authenticateMock)
        .toHaveBeenCalledWith(token, undefined)
    })

    /* Test: should resolve with authentication client error */
    it("should resolve with authentication client error", async () => {
      const event = mockAPIGatewayEventHttpPost({ username, password })
      const authenticateMock =
        mockAuthenticationClientAuthenticateWithError()
      const { statusCode, body } = await post(event)
      expect(statusCode).toEqual(400)
      expect(body).toEqual(JSON.stringify({
        type: "Error",
        message: "mockAuthenticationClientAuthenticateWithError"
      }))
      expect(authenticateMock)
        .toHaveBeenCalledWith(username, password)
    })
  })
})
