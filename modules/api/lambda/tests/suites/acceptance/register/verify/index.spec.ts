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

import { chance } from "_/helpers"
import { mockRegisterRequest } from "_/mocks/handlers/register"
import { mockVerificationCode } from "_/mocks/verification"

/* ----------------------------------------------------------------------------
 * Tests
 * ------------------------------------------------------------------------- */

/* Registration verification */
describe("POST /register/:code", () => {

  /* Authentication client */
  const auth = new AuthenticationClient()

  /* Initialize HTTP client */
  const http = request(process.env.API_INVOKE_URL!)

  /* Test: should return empty body */
  it("should return empty body", async () => {
    const user = mockRegisterRequest()
    const { id } = await auth.register(user.email, user.password)
    return http.post(`/register/${id}`)
      .set("Content-Type", "application/json")
      .expect(200, "")
  })

  /* Test: should set necessary cross-origin headers */
  it("should set necessary cross-origin headers", async () => {
    const user = mockRegisterRequest()
    const { id } = await auth.register(user.email, user.password)
    return http.post(`/register/${id}`)
      .set("Content-Type", "application/json")
      .expect("Access-Control-Allow-Origin",
        process.env.COGNITO_IDENTITY_DOMAIN!)
  })

  /* Test: should return error for malformed request */
  it("should return error for malformed request", () => {
    const { id } = mockVerificationCode("register")
    return http.post(`/register/${id}`)
      .set("Content-Type", "application/json")
      .send(`/${chance.string()}`)
      .expect(400, {
        type: "TypeError",
        message: "Invalid request body"
      })
  })

  /* Test: should return error for invalid request */
  it("should return error for invalid request", () => {
    const { id } = mockVerificationCode("register")
    return http.post(`/register/${id}`)
      .set("Content-Type", "application/json")
      .send(`{ "${chance.word()}": "${chance.string()}" }`)
      .expect(400, {
        type: "TypeError",
        message: "Invalid request body"
      })
  })

  /* Test: should return error for invalid verification code */
  it("should return error for invalid verification code", () => {
    const { id } = mockVerificationCode("register")
    return http.post(`/register/${id}`)
      .set("Content-Type", "application/json")
      .expect(400, {
        type: "Error",
        message: "Invalid verification code"
      })
  })
})
