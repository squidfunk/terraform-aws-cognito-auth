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

import {
  AuthenticateRequestWithCredentials as RequestWithCredentials,
  AuthenticateRequestWithToken as RequestWithToken
} from "common"
import { post } from "handlers/authenticate"

import {
  mockAuthenticationClientAuthenticateWithCredentialsWithError,
  mockAuthenticationClientAuthenticateWithCredentialsWithResult,
  mockAuthenticationClientAuthenticateWithTokenWithError,
  mockAuthenticationClientAuthenticateWithTokenWithResult
} from "_/mocks/clients"
import {
  mockAuthenticateRequestWithCredentials,
  mockAuthenticateRequestWithToken,
  mockSession
} from "_/mocks/common"
import { mockAPIGatewayProxyEvent } from "_/mocks/vendor/aws-lambda"

/* ----------------------------------------------------------------------------
 * Tests
 * ------------------------------------------------------------------------- */

/* Authentication */
describe("handlers/authenticate", () => {

  /* POST /authenticate */
  describe("post", () => {

    /* Session */
    const session = mockSession(true)

    /* with credentials */
    describe("with credentials", () => {

      /* Credentials and event */
      const { username, password } = mockAuthenticateRequestWithCredentials()
      const event = mockAPIGatewayProxyEvent<RequestWithCredentials>({
        body: { username, password }
      })

      /* Test: should resolve with identity token */
      it("should resolve with identity token", async () => {
        const authenticateMock =
          mockAuthenticationClientAuthenticateWithCredentialsWithResult(session)
        const { statusCode, body } = await post(event)
        expect(statusCode).toEqual(200)
        expect(JSON.parse(body)).toEqual(jasmine.objectContaining({
          id: jasmine.objectContaining({
            token: session.id.token
          })
        }))
        expect(authenticateMock)
          .toHaveBeenCalledWith(username, password)
      })

      /* Test: should resolve with access token */
      it("should resolve with access token", async () => {
        const authenticateMock =
          mockAuthenticationClientAuthenticateWithCredentialsWithResult(session)
        const { statusCode, body } = await post(event)
        expect(statusCode).toEqual(200)
        expect(JSON.parse(body)).toEqual(jasmine.objectContaining({
          access: jasmine.objectContaining({
            token: session.access.token
          })
        }))
        expect(authenticateMock)
          .toHaveBeenCalledWith(username, password)
      })

      /* Test: should resolve without refresh token (body) */
      it("should resolve without refresh token (body)", async () => {
        const authenticateMock =
          mockAuthenticationClientAuthenticateWithCredentialsWithResult(session)
        const { statusCode, body } = await post(event)
        expect(statusCode).toEqual(200)
        expect(JSON.parse(body).refresh).toBeUndefined()
        expect(authenticateMock)
          .toHaveBeenCalledWith(username, password)
      })

      /* Test: should resolve without refresh token (cookie) */
      it("should resolve without refresh token (cookie)", async () => {
        const authenticateMock =
          mockAuthenticationClientAuthenticateWithCredentialsWithResult(session)
        const { statusCode, headers } = await post(event)
        expect(statusCode).toEqual(200)
        expect(headers).toEqual({})
        expect(authenticateMock)
          .toHaveBeenCalledWith(username, password)
      })

      /* Test: should resolve with authentication client error */
      it("should resolve with authentication client error", async () => {
        const authenticateMock =
          mockAuthenticationClientAuthenticateWithCredentialsWithError()
        const { statusCode, body } = await post(event)
        expect(statusCode).toEqual(400)
        expect(body).toEqual(JSON.stringify({
          type: "Error",
          message: "authenticateWithCredentials"
        }))
        expect(authenticateMock)
          .toHaveBeenCalledWith(username, password)
      })
    })

    /* with credentials and remember me */
    describe("with credentials and remember me", () => {

      /* Credentials and event */
      const { username, password } = mockAuthenticateRequestWithCredentials()
      const event = mockAPIGatewayProxyEvent<RequestWithCredentials>({
        body: { username, password, remember: true }
      })

      /* Test: should resolve with identity token */
      it("should resolve with identity token", async () => {
        const authenticateMock =
          mockAuthenticationClientAuthenticateWithCredentialsWithResult(session)
        const { statusCode, body } = await post(event)
        expect(statusCode).toEqual(200)
        expect(JSON.parse(body)).toEqual(jasmine.objectContaining({
          id: jasmine.objectContaining({
            token: session.id.token
          })
        }))
        expect(authenticateMock)
          .toHaveBeenCalledWith(username, password)
      })

      /* Test: should resolve with access token */
      it("should resolve with access token", async () => {
        const authenticateMock =
          mockAuthenticationClientAuthenticateWithCredentialsWithResult(session)
        const { statusCode, body } = await post(event)
        expect(statusCode).toEqual(200)
        expect(JSON.parse(body)).toEqual(jasmine.objectContaining({
          access: jasmine.objectContaining({
            token: session.access.token
          })
        }))
        expect(authenticateMock)
          .toHaveBeenCalledWith(username, password)
      })

      /* Test: should resolve with refresh token (body) */
      it("should resolve with refresh token (body)", async () => {
        const authenticateMock =
          mockAuthenticationClientAuthenticateWithCredentialsWithResult(session)
        const { statusCode, body } = await post(event)
        expect(statusCode).toEqual(200)
        expect(JSON.parse(body)).toEqual(jasmine.objectContaining({
          refresh: jasmine.objectContaining({
            token: session.refresh!.token
          })
        }))
        expect(authenticateMock)
          .toHaveBeenCalledWith(username, password)
      })

      /* Test: should resolve with refresh token (cookie) */
      it("should resolve with refresh token (cookie)", async () => {
        const authenticateMock =
          mockAuthenticationClientAuthenticateWithCredentialsWithResult(session)
        const { statusCode, headers } = await post(event)
        expect(statusCode).toEqual(200)
        expect(headers).toEqual({
          "Set-Cookie": `__Secure-token=${
            encodeURIComponent(session.refresh!.token)
          }; Domain=${
            process.env.COGNITO_IDENTITY_POOL_PROVIDER!
          }; Path=/${
            process.env.API_BASE_PATH!
          }/authenticate; Expires=${
            session.refresh!.expires.toUTCString()
          }; HttpOnly; Secure; SameSite=Strict`
        })
        expect(authenticateMock)
          .toHaveBeenCalledWith(username, password)
      })

      /* Test: should resolve with authentication client error */
      it("should resolve with authentication client error", async () => {
        const authenticateMock =
          mockAuthenticationClientAuthenticateWithCredentialsWithError()
        const { statusCode, body } = await post(event)
        expect(statusCode).toEqual(400)
        expect(body).toEqual(JSON.stringify({
          type: "Error",
          message: "authenticateWithCredentials"
        }))
        expect(authenticateMock)
          .toHaveBeenCalledWith(username, password)
      })
    })

    /* with refresh token (body) */
    describe("with refresh token (body)", () => {

      /* Token and event */
      const { token } = mockAuthenticateRequestWithToken()
      const event = mockAPIGatewayProxyEvent<RequestWithToken>({
        body: { token }
      })

      /* Test: should resolve with identity token */
      it("should resolve with identity token", async () => {
        const authenticateMock =
          mockAuthenticationClientAuthenticateWithTokenWithResult(session)
        const { statusCode, body } = await post(event)
        expect(statusCode).toEqual(200)
        expect(JSON.parse(body)).toEqual(jasmine.objectContaining({
          id: jasmine.objectContaining({
            token: session.id.token
          })
        }))
        expect(authenticateMock).toHaveBeenCalledWith(token)
      })

      /* Test: should resolve with access token */
      it("should resolve with access token", async () => {
        const authenticateMock =
          mockAuthenticationClientAuthenticateWithTokenWithResult(session)
        const { statusCode, body } = await post(event)
        expect(statusCode).toEqual(200)
        expect(JSON.parse(body)).toEqual(jasmine.objectContaining({
          access: jasmine.objectContaining({
            token: session.access.token
          })
        }))
        expect(authenticateMock).toHaveBeenCalledWith(token)
      })

      /* Test: should resolve with error for missing token */
      it("should resolve with error for missing token", async () => {
        const authenticateMock =
          mockAuthenticationClientAuthenticateWithTokenWithResult()
        const { statusCode, body } =
          await post(mockAPIGatewayProxyEvent<RequestWithToken>())
        expect(statusCode).toEqual(400)
        expect(body).toEqual(JSON.stringify({
          type: "TypeError",
          message: "Invalid request"
        }))
        expect(authenticateMock).not.toHaveBeenCalled()
      })

      /* Test: should resolve with authentication client error */
      it("should resolve with authentication client error", async () => {
        const authenticateMock =
          mockAuthenticationClientAuthenticateWithTokenWithError()
        const { statusCode, body } = await post(event)
        expect(statusCode).toEqual(400)
        expect(body).toEqual(JSON.stringify({
          type: "Error",
          message: "authenticateWithToken"
        }))
        expect(authenticateMock).toHaveBeenCalledWith(token)
      })
    })

    /* with refresh token (cookie) */
    describe("with refresh token (cookie)", () => {

      /* Token and event */
      const { token } = mockAuthenticateRequestWithToken()
      const event = mockAPIGatewayProxyEvent<RequestWithToken>({
        headers: { Cookie: `__Secure-token=${token}` }
      })

      /* Test: should resolve with identity token */
      it("should resolve with identity token", async () => {
        const authenticateMock =
          mockAuthenticationClientAuthenticateWithTokenWithResult(session)
        const { statusCode, body } = await post(event)
        expect(statusCode).toEqual(200)
        expect(JSON.parse(body)).toEqual(jasmine.objectContaining({
          id: jasmine.objectContaining({
            token: session.id.token
          })
        }))
        expect(authenticateMock).toHaveBeenCalledWith(token)
      })

      /* Test: should resolve with access token */
      it("should resolve with access token", async () => {
        const authenticateMock =
          mockAuthenticationClientAuthenticateWithTokenWithResult(session)
        const { statusCode, body } = await post(event)
        expect(statusCode).toEqual(200)
        expect(JSON.parse(body)).toEqual(jasmine.objectContaining({
          access: jasmine.objectContaining({
            token: session.access.token
          })
        }))
        expect(authenticateMock).toHaveBeenCalledWith(token)
      })

      /* Test: should resolve with error for missing token */
      it("should resolve with error for missing token", async () => {
        const authenticateMock =
          mockAuthenticationClientAuthenticateWithTokenWithResult()
        const { statusCode, body } =
          await post(mockAPIGatewayProxyEvent<RequestWithToken>())
        expect(statusCode).toEqual(400)
        expect(body).toEqual(JSON.stringify({
          type: "TypeError",
          message: "Invalid request"
        }))
        expect(authenticateMock).not.toHaveBeenCalled()
      })

      /* Test: should resolve with authentication client error */
      it("should resolve with authentication client error", async () => {
        const authenticateMock =
          mockAuthenticationClientAuthenticateWithTokenWithError()
        const { statusCode, body } = await post(event)
        expect(statusCode).toEqual(400)
        expect(body).toEqual(JSON.stringify({
          type: "Error",
          message: "authenticateWithToken"
        }))
        expect(authenticateMock).toHaveBeenCalledWith(token)
      })

      /* Test: should invalidate cookie for invalid token */
      it("should invalidate cookie for invalid token", async () => {
        const authenticateMock =
          mockAuthenticationClientAuthenticateWithTokenWithError()
        const { statusCode, headers, body } = await post(event)
        expect(statusCode).toEqual(400)
        expect(headers).toEqual({
          "Set-Cookie": `__Secure-token=; Domain=${
            process.env.COGNITO_IDENTITY_POOL_PROVIDER!
          }; Path=/${
            process.env.API_BASE_PATH!
          }/authenticate; Expires=${
            new Date(0).toUTCString()
          }; HttpOnly; Secure; SameSite=Strict`
        })
        expect(body).toEqual(JSON.stringify({
          type: "Error",
          message: "authenticateWithToken"
        }))
        expect(authenticateMock).toHaveBeenCalledWith(token)
      })
    })
  })
})
