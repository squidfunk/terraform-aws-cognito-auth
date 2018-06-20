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

import { post } from "handlers/authenticate"

import {
  AuthenticateRequestWithCredentials as RequestWithCredentials,
  AuthenticateRequestWithToken as RequestWithToken
} from "common/events/authenticate"

import { chance } from "_/helpers"
import {
  mockAuthenticationClientAuthenticateWithError,
  mockAuthenticationClientAuthenticateWithResult
} from "_/mocks/clients/authentication"
import {
  mockAuthenticateRequestWithCredentials,
  mockAuthenticateRequestWithToken
} from "_/mocks/common/events/authenticate"
import { mockSession } from "_/mocks/common/session"
import { mockAPIGatewayProxyEvent } from "_/mocks/vendor/aws-lambda"

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
      const event = mockAPIGatewayProxyEvent<RequestWithCredentials>({
        body: { username, password }
      })
      const authenticateMock =
        mockAuthenticationClientAuthenticateWithResult(session)
      const { statusCode, body } = await post(event)
      expect(statusCode).toEqual(200)
      expect(body).toEqual(JSON.stringify(session))
      expect(authenticateMock)
        .toHaveBeenCalledWith(username, password)
    })

    /* Test: should resolve with session for valid refresh token (body) */
    it("should resolve with session for valid refresh token (body)",
      async () => {
        const event = mockAPIGatewayProxyEvent<RequestWithToken>({
          body: { token }
        })
        const authenticateMock =
          mockAuthenticationClientAuthenticateWithResult(session)
        const { statusCode, body } = await post(event)
        expect(statusCode).toEqual(200)
        expect(body).toEqual(JSON.stringify(session))
        expect(authenticateMock)
          .toHaveBeenCalledWith(token, undefined)
      })

    /* Test: should resolve with session for valid refresh token (cookie) */
    it("should resolve with session for valid refresh token (cookie)",
      async () => {
        const event = mockAPIGatewayProxyEvent<RequestWithToken>({
          headers: { Cookie: `__Secure-token=${token}` }
        })
        const authenticateMock =
          mockAuthenticationClientAuthenticateWithResult(session)
        const { statusCode, body } = await post(event)
        expect(statusCode).toEqual(200)
        expect(body).toEqual(JSON.stringify(session))
        expect(authenticateMock)
          .toHaveBeenCalledWith(token, undefined)
      })

    /* Test: should resolve with scoped, secure, http-only cookie */
    it("should resolve with scoped, secure, http-only cookie",
      async () => {
        const sessionWithRefreshToken = mockSession(true)
        const path = chance.string()
        const event = mockAPIGatewayProxyEvent<RequestWithCredentials>({
          path, body: { username, password }
        })
        mockAuthenticationClientAuthenticateWithResult(sessionWithRefreshToken)
        const { statusCode, headers } = await post(event)
        expect(statusCode).toEqual(200)
        expect(headers).toEqual({
          "Set-Cookie": `__Secure-token=${
            encodeURIComponent(sessionWithRefreshToken.refresh!.token)
          }; Domain=${
            process.env.COGNITO_IDENTITY_DOMAIN!
          }; Path=${path}; Expires=${
            sessionWithRefreshToken.refresh!.expires.toUTCString()
          }; HttpOnly; Secure; SameSite=Strict`
        })
      })

    /* Test: should resolve with error for missing token (body, cookie) */
    it("should resolve with error for missing token (body, cookie)",
      async () => {
        const event = mockAPIGatewayProxyEvent<RequestWithToken>()
        const authenticateMock =
          mockAuthenticationClientAuthenticateWithResult()
        const { statusCode, body } = await post(event)
        expect(statusCode).toEqual(400)
        expect(body).toEqual(JSON.stringify({
          type: "TypeError",
          message: "Invalid request"
        }))
        expect(authenticateMock).not.toHaveBeenCalled()
      })

    /* Test: should resolve with authentication client error */
    it("should resolve with authentication client error", async () => {
      const event = mockAPIGatewayProxyEvent<RequestWithCredentials>({
        body: { username, password }
      })
      const authenticateMock =
        mockAuthenticationClientAuthenticateWithError()
      const { statusCode, body } = await post(event)
      expect(statusCode).toEqual(400)
      expect(body).toEqual(JSON.stringify({
        type: "Error",
        message: "authenticate"
      }))
      expect(authenticateMock)
        .toHaveBeenCalledWith(username, password)
    })
  })
})
