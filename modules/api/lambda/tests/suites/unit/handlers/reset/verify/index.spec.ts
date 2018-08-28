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
  ResetVerificationParameters as Parameters,
  ResetVerificationRequest as Request
} from "common"
import { post } from "handlers/reset/verify"

import {
  mockManagementClientChangePasswordWithError,
  mockManagementClientChangePasswordWithSuccess
} from "_/mocks/clients"
import { mockResetVerifyRequest } from "_/mocks/common"
import { mockAPIGatewayProxyEvent } from "_/mocks/vendor/aws-lambda"
import {
  mockVerificationClaimWithError,
  mockVerificationClaimWithResult,
  mockVerificationCode
} from "_/mocks/verification"

/* ----------------------------------------------------------------------------
 * Tests
 * ------------------------------------------------------------------------- */

/* Reset verification */
describe("handlers/reset/verify", () => {

  /* POST /reset/:code */
  describe("post", () => {

    /* Password, verification code and event */
    const { password } = mockResetVerifyRequest()
    const code = mockVerificationCode()
    const event = mockAPIGatewayProxyEvent<Parameters, Request>({
      body: { password }, pathParameters: { code: code.id }
    })

    /* Test: should resolve with empty body */
    it("should resolve with empty body", async () => {
      const claimMock = mockVerificationClaimWithResult(code)
      const changePasswordMock =
        mockManagementClientChangePasswordWithSuccess()
      const { statusCode, body } = await post(event)
      expect(statusCode).toEqual(204)
      expect(body).toEqual("")
      expect(claimMock)
        .toHaveBeenCalledWith("reset", code.id)
      expect(changePasswordMock)
        .toHaveBeenCalledWith(code.subject, password)
    })

    /* Test: should resolve with password policy error */
    it("should resolve with password policy error", async () => {
      const claimMock = mockVerificationClaimWithError()
      const { statusCode, body } = await post(
        mockAPIGatewayProxyEvent<Parameters, Request>({
          body: { password: "" }
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
      expect(claimMock).not.toHaveBeenCalledWith()
    })

    /* Test: should resolve with verification error */
    it("should resolve with verification error", async () => {
      const claimMock = mockVerificationClaimWithError()
      const changePasswordMock =
        mockManagementClientChangePasswordWithSuccess()
      const { statusCode, body } = await post(event)
      expect(statusCode).toEqual(403)
      expect(body).toEqual(JSON.stringify({
        type: "Error",
        message: "claim"
      }))
      expect(claimMock)
        .toHaveBeenCalledWith("reset", code.id)
      expect(changePasswordMock)
        .not.toHaveBeenCalled()
    })

    /* Test: should resolve with management client error */
    it("should resolve with management client error", async () => {
      const claimMock = mockVerificationClaimWithResult(code)
      const changePasswordMock =
        mockManagementClientChangePasswordWithError()
      const { statusCode, body } = await post(event)
      expect(statusCode).toEqual(403)
      expect(body).toEqual(JSON.stringify({
        type: "Error",
        message: "changePassword"
      }))
      expect(claimMock)
        .toHaveBeenCalledWith("reset", code.id)
      expect(changePasswordMock)
        .toHaveBeenCalledWith(code.subject, password)
    })
  })
})
