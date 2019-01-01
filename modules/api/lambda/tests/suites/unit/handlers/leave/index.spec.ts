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

import { LeaveRequest } from "common"
import { post } from "handlers/leave"

import { chance } from "_/helpers"
import {
  mockSessionClientSignOutWithError,
  mockSessionClientSignOutWithSuccess
} from "_/mocks/clients"
import { mockAPIGatewayProxyEvent } from "_/mocks/vendor/aws-lambda"

/* ----------------------------------------------------------------------------
 * Tests
 * ------------------------------------------------------------------------- */

/* Terminate session */
describe("handlers/leave", () => {

  /* POST /leave */
  describe("post", () => {

    /* Access token and event */
    const token = chance.hash({ length: 128 })
    const event = mockAPIGatewayProxyEvent<{}, LeaveRequest>({
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    /* Test: should resolve with empty body */
    it("should resolve with empty body", async () => {
      const signOutMock = mockSessionClientSignOutWithSuccess()
      const { statusCode, body } = await post(event)
      expect(statusCode).toEqual(204)
      expect(body).toEqual("")
      expect(signOutMock).toHaveBeenCalled()
    })

    /* Test: should invalidate cookie for valid token */
    it("should invalidate cookie for valid token", async () => {
      const signOutMock = mockSessionClientSignOutWithSuccess()
      const { statusCode, headers } = await post(event)
      expect(statusCode).toEqual(204)
      expect(headers).toEqual({
        "Set-Cookie": `__Secure-token=; Domain=${
          process.env.COGNITO_IDENTITY_POOL_PROVIDER!
        }; Path=/${
          process.env.API_BASE_PATH!
        }/authenticate; Expires=${
          new Date(0).toUTCString()
        }; HttpOnly; Secure; SameSite=Strict`
      })
      expect(signOutMock).toHaveBeenCalled()
    })

    /* Test: should invalidate cookie for invalid token */
    it("should invalidate cookie for invalid token", async () => {
      const signOutMock = mockSessionClientSignOutWithError()
      const { statusCode, headers } = await post(event)
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
      expect(signOutMock).toHaveBeenCalled()
    })

    /* Test: should invalidate cookie for missing token */
    it("should invalidate cookie for missing token", async () => {
      const signOutMock = mockSessionClientSignOutWithError()
      const { statusCode, headers } = await post(
        mockAPIGatewayProxyEvent<{}, LeaveRequest>())
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
      expect(signOutMock).toHaveBeenCalled()
    })

    /* Test: should resolve with session client error */
    it("should resolve with session client error", async () => {
      const signOutMock = mockSessionClientSignOutWithError()
      const { statusCode, body } = await post(event)
      expect(statusCode).toEqual(400)
      expect(body).toEqual(JSON.stringify({
        type: "Error",
        message: "signOut"
      }))
      expect(signOutMock).toHaveBeenCalled()
    })
  })
})
