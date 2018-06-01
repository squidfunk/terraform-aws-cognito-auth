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
import {
  mockRegisterRequest,
  mockRegisterRequestWithInvalidEmail
} from "_/mocks/handlers/register"

/* ----------------------------------------------------------------------------
 * Tests
 * ------------------------------------------------------------------------- */

/* Registration verification */
describe("POST /register/:code", () => {

  /* Authentication and management client */
  const auth = new AuthenticationClient()
  const mgmt = new ManagementClient()

  /* Initialize HTTP client */
  const http = request(process.env.API_INVOKE_URL!)

  // /* Test: should accept 8-letter passwords */
  // it("should accept 8-letter passwords", () => {
  //   return http.post("/register/:code")
  //     .set("Content-Type", "application/json")
  //     .send(mockRegisterRequest({ length: 8 }))
  //     .expect(200)
  // })
  //
  // /* Test: should accept 256-letter passwords */
  // it("should accept 256-letter passwords", () => {
  //   return http.post("/register")
  //     .set("Content-Type", "application/json")
  //     .send(mockRegisterRequest({ length: 256 }))
  //     .expect(200)
  // })
  //
  // /* Test: should return empty result */
  // it("should return empty result", () => {
  //   return http.post("/register")
  //     .set("Content-Type", "application/json")
  //     .send(mockRegisterRequest())
  //     .expect(200, "")
  // })
  //
  // /* Test: should return error for empty request */
  // it("should return error for empty request", () => {
  //   return http.post("/register")
  //     .set("Content-Type", "application/json")
  //     .expect(400, {
  //       type: "TypeError",
  //       message: "Invalid request body"
  //     })
  // })
  //
  // /* Test: should return error for malformed request */
  // it("should return error for malformed request", () => {
  //   return http.post("/register")
  //     .set("Content-Type", "application/json")
  //     .send(`/${chance.string()}`)
  //     .expect(400, {
  //       type: "SyntaxError",
  //       message: "Unexpected token / in JSON at position 0"
  //     })
  // })
  //
  // /* Test: should return error for invalid email address */
  // it("should return error for invalid email address", () => {
  //   return http.post("/register")
  //     .set("Content-Type", "application/json")
  //     .send(mockRegisterRequestWithInvalidEmail())
  //     .expect(400, {
  //       type: "InvalidParameterException",
  //       message: "Invalid email address format"
  //     })
  // })
  //
  // /* Test: should return error for invalid password: length < 8 */
  // it("should return error for invalid password: length < 8", () => {
  //   return http.post("/register")
  //     .set("Content-Type", "application/json")
  //     .send(mockRegisterRequest({ length: 7 }))
  //     .expect(400, {
  //       type: "InvalidPasswordException",
  //       message:
  //         "Password did not conform with policy: " +
  //         "Password not long enough"
  //     })
  // })
  //
  // /* Test: should return error for invalid password: length > 256 */
  // it("should return error for invalid password: length > 256", () => {
  //   return http.post("/register")
  //     .set("Content-Type", "application/json")
  //     .send(mockRegisterRequest({ length: 257 }))
  //     .expect(400, {
  //       type: "InvalidParameterException",
  //       message:
  //         "1 validation error detected: " +
  //         "Value at 'password' failed to satisfy constraint: " +
  //         "Member must have length less than or equal to 256"
  //     })
  // })
  //
  // /* Test: should return error for invalid password: missing numbers */
  // it("should return error for invalid password: missing numbers", () => {
  //   return http.post("/register")
  //     .set("Content-Type", "application/json")
  //     .send(mockRegisterRequest({ numbers: false }))
  //     .expect(400, {
  //       type: "InvalidPasswordException",
  //       message:
  //         "Password did not conform with policy: " +
  //         "Password must have numeric characters"
  //     })
  // })
  //
  // /* Test: should return error for invalid password: missing symbols */
  // it("should return error for invalid password: missing symbols", () => {
  //   return http.post("/register")
  //     .set("Content-Type", "application/json")
  //     .send(mockRegisterRequest({ symbols: false }))
  //     .expect(400, {
  //       type: "InvalidPasswordException",
  //       message:
  //         "Password did not conform with policy: " +
  //         "Password must have symbol characters"
  //     })
  // })
  //
  // /* Test: should return error for invalid password: missing uppercase */
  // it("should return error for invalid password: missing uppercase", () => {
  //   return http.post("/register")
  //     .set("Content-Type", "application/json")
  //     .send(mockRegisterRequest({ uppercase: false }))
  //     .expect(400, {
  //       type: "InvalidPasswordException",
  //       message:
  //         "Password did not conform with policy: " +
  //         "Password must have uppercase characters"
  //     })
  // })

  /* with existent user */
  fdescribe("with existent user", () => {

    /* User */
    const user = mockRegisterRequest()

    /* Create and verify user */
    beforeAll(async () => {
      const { subject } = await auth.register(user.email, user.password)
      console.log(subject)
      await mgmt.verifyUser(subject)
    })

    /* Delete user */
    afterAll(async () => {
      await mgmt.deleteUser(user.email)
    })

    it("should return error for existing user", async () => {
      const { subject } = await auth.register(user.email, user.password)
      console.log(subject)
      await mgmt.verifyUser(subject)
      // return http.post(`/register/${id}`)
      //   .set("Content-Type", "application/json")
      //   .expect(400, {
      //     code: "blalala"
      //   })
    })
  })
})
