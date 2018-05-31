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

import {
  mockAuthenticateRequestWithCredentials,
  mockAuthenticateRequestWithToken
} from "_/mocks/handlers/authenticate"
import {
  mockRegisterRequest
} from "_/mocks/handlers/register"

/* ----------------------------------------------------------------------------
 * Tests
 * ------------------------------------------------------------------------- */

/* Lambda authentication handler */
describe("handlers/authenticate", () => {

  /* Initialize HTTP client */
  const http = request(process.env.API_INVOKE_URL!)

  /* Test: should respond with 400 on malformed request */
  it("should respond with 400 on malformed request", () => {
    return http.post("/authenticate")
      .expect(400, { message: "Invalid request body" })
  })

  /* Test: should respond with 400 on non-existent user */
  it("should respond with 400 on non-existent user", () => {
    return http.post("/authenticate")
      .send(mockAuthenticateRequestWithCredentials())
      .expect(400, { message: "User does not exist" })
  })

  /* Test: should respond with 400 on invalid refresh token */
  it("should respond with 400 on invalid refresh token", () => {
    return http.post("/authenticate")
      .send(mockAuthenticateRequestWithToken())
      .expect(400, { message: "Invalid Refresh Token" })
  })

  /* with existent user */
  describe("with existent user", () => {

    /* User */
    const user = mockRegisterRequest()

    /* Create and verify user */
    beforeAll(async () => {
      const auth = AuthenticationClient.factory()
      const mgmt = ManagementClient.factory()
      console.log(user)
      await auth.register(user.email, user.password)
      await mgmt.verifyUser(user.email)
      console.log(user)
    })

    it("should whatever...", () => {
      return http.post("/authenticate")
        .send({ username: user.email, password: user.password })
        .expect(200, { message: "Invalid request body" })
    })
  })
})
