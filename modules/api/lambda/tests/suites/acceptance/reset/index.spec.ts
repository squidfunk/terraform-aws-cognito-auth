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

import { AuthenticationClient } from "clients/authentication"
import { ManagementClient } from "clients/management"

import { chance, request } from "_/helpers"
import {
  mockRegisterRequest,
  mockResetRequest
} from "_/mocks/common"

/* ----------------------------------------------------------------------------
 * Tests
 * ------------------------------------------------------------------------- */

/* Reset */
describe("POST /reset", () => {

  /* Authentication and management client */
  const auth = new AuthenticationClient()
  const mgmt = new ManagementClient()

  /* Test: should return error for empty request */
  it("should return error for empty request", () => {
    return request.post("/reset")
      .set("Content-Type", "application/json")
      .expect(400, {
        type: "TypeError",
        message: "Invalid request"
      })
  })

  /* Test: should return error for malformed request */
  it("should return error for malformed request", () => {
    return request.post("/reset")
      .set("Content-Type", "application/json")
      .send(`/${chance.string()}`)
      .expect(400, {
        type: "TypeError",
        message: "Invalid request"
      })
  })

  /* Test: should return error for invalid request */
  it("should return error for invalid request", () => {
    return request.post("/reset")
      .set("Content-Type", "application/json")
      .send(`{}`)
      .expect(400, {
        type: "TypeError",
        message: "Invalid request"
      })
  })

  /* Test: should return error for invalid user */
  it("should return error for invalid user", () => {
    return request.post("/reset")
      .set("Content-Type", "application/json")
      .send(mockResetRequest())
      .expect(400, {
        type: "UserNotFoundException",
        message: "User does not exist"
      })
  })

  /* with unconfirmed user */
  describe("with unconfirmed user", () => {

    /* Registration request */
    const { email, password } = mockRegisterRequest()

    /* User identifier */
    let id: string

    /* Create and verify user */
    beforeAll(async () => {
      const { subject } = await auth.register(email, password)
      id = subject
    })

    /* Delete user */
    afterAll(async () => {
      await mgmt.deleteUser(id)
    })

    /* Test: should return error for unverified user */
    it("should return error for unverified user", () => {
      return request.post("/reset")
        .set("Content-Type", "application/json")
        .send({ username: email })
        .expect(400, {
          type: "UserNotFoundException",
          message: "User does not exist"
        })
    })
  })

  /* with confirmed user */
  describe("with confirmed user", () => {

    /* Registration request */
    const { email, password } = mockRegisterRequest()

    /* Create and verify user */
    beforeAll(async () => {
      const { subject } = await auth.register(email, password)
      await mgmt.verifyUser(subject)
    })

    /* Delete user */
    afterAll(async () => {
      await mgmt.deleteUser(email)
    })

    /* Test: should return empty body */
    it("should return empty body", () => {
      return request.post("/reset")
        .set("Content-Type", "application/json")
        .send({ username: email })
        .expect(200, "{}")
    })
  })
})
