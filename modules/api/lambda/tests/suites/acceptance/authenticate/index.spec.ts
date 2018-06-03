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
import { Session } from "~/clients/session"

import { chance } from "_/helpers"
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

/* Authentication */
describe("POST /authenticate", () => {

  /* Authentication and management client */
  const auth = new AuthenticationClient()
  const mgmt = new ManagementClient()

  /* Initialize HTTP client */
  const http = request(process.env.API_INVOKE_URL!)

  /* Test: should force application/json as content type */
  it("should force application/json as content type", () => {
    return http.post("/authenticate")
      .send(mockAuthenticateRequestWithCredentials())
      .expect(400, {
        type: "UserNotFoundException",
        message: "User does not exist"
      })
  })

  /* Test: should return error for empty request */
  it("should return error for empty request", () => {
    return http.post("/authenticate")
      .set("Content-Type", "application/json")
      .expect(400, {
        type: "TypeError",
        message: "Invalid request body"
      })
  })

  /* Test: should return error for malformed request */
  it("should return error for malformed request", () => {
    return http.post("/authenticate")
      .set("Content-Type", "application/json")
      .send(`/${chance.string()}`)
      .expect(400, {
        type: "SyntaxError",
        message: "Unexpected token / in JSON at position 0"
      })
  })

  /* Test: should return error for invalid request */
  it("should return error for invalid request", () => {
    return http.post("/authenticate")
      .set("Content-Type", "application/json")
      .send(`{}`)
      .expect(400, {
        type: "TypeError",
        message: "Invalid request body"
      })
  })

  /* Test: should return error for non-existent user */
  it("should return error for non-existent user", () => {
    return http.post("/authenticate")
      .set("Content-Type", "application/json")
      .send(mockAuthenticateRequestWithCredentials())
      .expect(400, {
        type: "UserNotFoundException",
        message: "User does not exist"
      })
  })

  /* Test: should return error for invalid refresh token */
  it("should return error for invalid refresh token", () => {
    return http.post("/authenticate")
      .set("Content-Type", "application/json")
      .send(mockAuthenticateRequestWithToken())
      .expect(400, {
        type: "NotAuthorizedException",
        message: "Invalid Refresh Token"
      })
  })

  /* with unconfirmed user */
  describe("with unconfirmed user", () => {

    /* User */
    const user = mockRegisterRequest()

    /* User identifier */
    let id: string

    /* Create and verify user */
    beforeAll(async () => {
      const { subject } = await auth.register(user.email, user.password)
      id = subject
    })

    /* Delete user */
    afterAll(async () => {
      await mgmt.deleteUser(id)
    })

    /* Test: should return error for valid credentials */
    it("should return error for valid credentials", async () => {
      return http.post("/authenticate")
        .set("Content-Type", "application/json")
        .send({ username: user.email, password: user.password })
        .expect(400, {
          type: "UserNotFoundException",
          message: "User does not exist"
        })
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

    /* Test: should return access token for valid credentials */
    it("should return access token for valid credentials", async () => {
      const { body }: { body: Session } = await http.post("/authenticate")
        .set("Content-Type", "application/json")
        .send({ username: user.email, password: user.password })
        .expect(200)
      expect(body.access.token)
        .toMatch(/^([a-zA-Z0-9\-_]+\.){2}[a-zA-Z0-9\-_]+$/)
      expect(Date.parse(body.access.expires))
        .toBeGreaterThan(Date.now() + 59 * 60)
    })

    /* Test: should return refresh token for valid credentials */
    it("should return refresh token for valid credentials", async () => {
      const { body }: { body: Session } = await http.post("/authenticate")
        .set("Content-Type", "application/json")
        .send({ username: user.email, password: user.password })
        .expect(200)
      expect(body.refresh!.token)
        .toMatch(/^([a-zA-Z0-9\-_]+\.){4}[a-zA-Z0-9\-_]+$/)
      expect(Date.parse(body.refresh!.expires))
        .toBeGreaterThan(Date.now() + 59 * 60 * 24 * 30)
    })

    /* Test: should return access token for valid refresh token */
    it("should return access token for valid refresh token", async () => {
      const { body: { refresh } }: { body: Session } =
        await http.post("/authenticate")
          .set("Content-Type", "application/json")
          .send({ username: user.email, password: user.password })
          .expect(200)
      const { body }: { body: Session } = await http.post("/authenticate")
        .send({ token: refresh!.token })
        .expect(200)
      expect(body.access.token)
        .toMatch(/^([a-zA-Z0-9\-_]+\.){2}[a-zA-Z0-9\-_]+$/)
      expect(Date.parse(body.access.expires))
        .toBeGreaterThan(Date.now() + 59 * 60)
    })

    /* Test: should return error for invalid credentials */
    it("should return error for invalid credentials", () => {
      return http.post("/authenticate")
        .set("Content-Type", "application/json")
        .send({ username: user.email, password: chance.string() })
        .expect(400, {
          type: "NotAuthorizedException",
          message: "Incorrect username or password"
        })
    })
  })
})
