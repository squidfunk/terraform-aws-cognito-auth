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
  mockAuthenticationClientAuthenticateWithResult
} from "_/mocks/clients/authentication"
import { mockSession } from "_/mocks/clients/session"
import {
  mockAuthenticateRequestWithCredentials,
  mockAuthenticateRequestWithToken
} from "_/mocks/handlers/authenticate"
import { mockAPIGatewayEvent } from "_/mocks/vendor/aws-lambda"

/* ----------------------------------------------------------------------------
 * Tests
 * ------------------------------------------------------------------------- */

/* Authentication */
describe("handlers/authenticate", () => {

  /* POST /authenticate */
  describe("post", () => {

    /* Credentials, token and session */
    const credentials = mockAuthenticateRequestWithCredentials()
    const token = mockAuthenticateRequestWithToken()
    const session = mockSession()

    /* Test: should resolve with session for credentials */
    it("should resolve with session for credentials", async () => {
      const event = mockAPIGatewayEvent("POST", credentials)
      const authenticateMock =
        mockAuthenticationClientAuthenticateWithResult(session)
      const { body } = await post(event)
      expect(body).toEqual(JSON.stringify(session))
      expect(authenticateMock)
        .toHaveBeenCalledWith(...Object.values(credentials))
    })

    /* Test: should resolve with session for token */
    it("should resolve with session for token", async () => {
      const event = mockAPIGatewayEvent("POST", token)
      const authenticateMock =
        mockAuthenticationClientAuthenticateWithResult(session)
      const { body } = await post(event)
      expect(body).toEqual(JSON.stringify(session))
      expect(authenticateMock)
        .toHaveBeenCalledWith(...Object.values(token), undefined)
    })

    /* Test: should resolve with client error */
    it("should resolve with client error", async () => {
      const event = mockAPIGatewayEvent("POST", credentials)
      const authenticateMock =
        mockAuthenticationClientAuthenticateWithError()
      const { body, statusCode } = await post(event)
      expect(statusCode).toEqual(400)
      expect(body).toEqual(JSON.stringify({
        type: "Error",
        message: "mockAuthenticationClientAuthenticateWithError"
      }))
      expect(authenticateMock)
        .toHaveBeenCalledWith(...Object.values(credentials))
    })
  })
})
