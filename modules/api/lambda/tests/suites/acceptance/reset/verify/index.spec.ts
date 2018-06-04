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

import * as request from "supertest"

import { AuthenticationClient } from "~/clients/authentication"
import { ManagementClient } from "~/clients/management"

import { chance } from "_/helpers"
import { mockRegisterRequest } from "_/mocks/handlers/register"
import { mockResetVerifyRequest } from "_/mocks/handlers/reset/verify"
import { mockVerificationCode } from "_/mocks/verification"

/* ----------------------------------------------------------------------------
 * Tests
 * ------------------------------------------------------------------------- */

/* Reset verification */
describe("POST /reset/:code", () => {

  /* Authentication and management client */
  const auth = new AuthenticationClient()
  const mgmt = new ManagementClient()

  /* Initialize HTTP client */
  const http = request(process.env.API_INVOKE_URL!)

  /* Test: should return error for malformed request */
  it("should return error for malformed request", () => {
    const { id } = mockVerificationCode("reset")
    return http.post(`/reset/${id}`)
      .set("Content-Type", "application/json")
      .send(`/${chance.string()}`)
      .expect(400, {
        type: "SyntaxError",
        message: "Unexpected token / in JSON at position 0"
      })
  })

  /* Test: should return error for invalid request */
  it("should return error for invalid request", () => {
    const { id } = mockVerificationCode("reset")
    return http.post(`/reset/${id}`)
      .set("Content-Type", "application/json")
      .send(`{ "${chance.word()}": "${chance.string()}" }`)
      .expect(400, {
        type: "TypeError",
        message: "Invalid request body"
      })
  })

  /* Test: should return error for invalid verification code */
  it("should return error for invalid verification code", () => {
    const { id } = mockVerificationCode("reset")
    return http.post(`/reset/${id}`)
      .set("Content-Type", "application/json")
      .send(mockResetVerifyRequest())
      .expect(400, {
        type: "Error",
        message: "Invalid verification code"
      })
  })

  /* with confirmed user */
  describe("with confirmed user", () => {

    /* User */
    const user = mockRegisterRequest()

    /* Create and verify user */
    beforeAll(async () => {
      const { subject } = await auth.register(user.email, user.password)
      await mgmt.verifyUser(subject)
    })

    /* Delete user */
    afterAll(async () => {
      await mgmt.deleteUser(user.email)
    })

    /* Test: should return empty result */
    it("should return empty result", async () => {
      const { id } = await auth.forgotPassword(user.email)
      return http.post(`/reset/${id}`)
        .set("Content-Type", "application/json")
        .send(mockResetVerifyRequest())
        .expect(200, "")
    })

    /* Test: should set new password */
    it("should set new password", async () => {
      const { id, subject } = await auth.forgotPassword(user.email)
      const { password } = mockResetVerifyRequest()
      await http.post(`/reset/${id}`)
        .set("Content-Type", "application/json")
        .send({ password })
        .expect(200, "")
      expect(async () => {
        await auth.authenticate(subject, password)
      }).not.toThrow()
    })

    /* Test: should set necessary cross-origin headers */
    it("should set necessary cross-origin headers", async () => {
      const { id } = await auth.forgotPassword(user.email)
      return http.post(`/reset/${id}`)
        .set("Content-Type", "application/json")
        .send(mockResetVerifyRequest())
        .expect("Access-Control-Allow-Origin",
          process.env.COGNITO_IDENTITY_DOMAIN!)
    })
  })
})
