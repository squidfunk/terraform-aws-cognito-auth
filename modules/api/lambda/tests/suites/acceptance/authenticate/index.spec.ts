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
  mockAuthenticateRequestWithCredentials,
  mockAuthenticateRequestWithToken,
  mockRegisterRequest
} from "_/mocks/common"

/* ----------------------------------------------------------------------------
 * Tests
 * ------------------------------------------------------------------------- */

/* Authentication */
describe("POST /authenticate", () => {

  /* Authentication and management client */
  const auth = new AuthenticationClient()
  const mgmt = new ManagementClient()

  /* Test: should return error for empty request */
  it("should return error for empty request", () => {
    return request.post("/authenticate")
      .set("Content-Type", "application/json")
      .expect(400, {
        type: "TypeError",
        message: "Invalid request"
      })
  })

  /* Test: should return error for malformed request */
  it("should return error for malformed request", () => {
    return request.post("/authenticate")
      .set("Content-Type", "application/json")
      .send(`/${chance.string()}`)
      .expect(400, {
        type: "TypeError",
        message: "Invalid request"
      })
  })

  /* Test: should return error for invalid request */
  it("should return error for invalid request", () => {
    return request.post("/authenticate")
      .set("Content-Type", "application/json")
      .send(`{}`)
      .expect(400, {
        type: "TypeError",
        message: "Invalid request"
      })
  })

  /* Test: should return error for non-existent user */
  it("should return error for non-existent user", () => {
    return request.post("/authenticate")
      .set("Content-Type", "application/json")
      .send(mockAuthenticateRequestWithCredentials())
      .expect(400, {
        type: "NotAuthorizedException",
        message: "Incorrect username or password"
      })
  })

  /* Test: should return error for invalid refresh token */
  it("should return error for invalid refresh token", () => {
    return request.post("/authenticate")
      .set("Content-Type", "application/json")
      .send(mockAuthenticateRequestWithToken())
      .expect(400, {
        type: "NotAuthorizedException",
        message: "Invalid Refresh Token"
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

    /* Test: should return error for valid credentials */
    it("should return error for valid credentials", async () => {
      return request.post("/authenticate")
        .set("Content-Type", "application/json")
        .send({ username: email, password })
        .expect(400, {
          type: "NotAuthorizedException",
          message: "Incorrect username or password"
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

    /* Test: should return identity token for valid credentials */
    it("should return identity token for valid credentials", async () => {
      const { body } = await request.post("/authenticate")
        .set("Content-Type", "application/json")
        .send({ username: email, password })
        .expect(200)
      expect(body.id.token)
        .toMatch(/^([a-zA-Z0-9\-_]+\.){2}[a-zA-Z0-9\-_]+$/)
      expect(Date.parse(body.id.expires))
        .toBeGreaterThan(Date.now() + 1000 * 59 * 60)
    })

    /* Test: should return access token for valid credentials */
    it("should return access token for valid credentials", async () => {
      const { body } = await request.post("/authenticate")
        .set("Content-Type", "application/json")
        .send({ username: email, password })
        .expect(200)
      expect(body.access.token)
        .toMatch(/^([a-zA-Z0-9\-_]+\.){2}[a-zA-Z0-9\-_]+$/)
      expect(Date.parse(body.access.expires))
        .toBeGreaterThan(Date.now() + 1000 * 59 * 60)
    })

    /* Test: should return refresh token for valid credentials (body) */
    it("should return refresh token for valid credentials (body)",
      async () => {
        const { body } = await request.post("/authenticate")
          .set("Content-Type", "application/json")
          .send({ username: email, password, remember: true })
          .expect(200)
        expect(body.refresh.token)
          .toMatch(/^([a-zA-Z0-9\-_]+\.){4}[a-zA-Z0-9\-_]+$/)
        expect(Date.parse(body.refresh.expires))
          .toBeGreaterThan(Date.now() + 1000 * 59 * 60 * 24 * 30)
      })

    /* Test: should return refresh token for valid credentials (cookie) */
    it("should return refresh token for valid credentials (cookie)",
      async () => {
        const { body, header } = await request.post("/authenticate")
          .set("Content-Type", "application/json")
          .send({ username: email, password, remember: true })
          .expect(200)
        expect(header["set-cookie"]).toMatch(
          `__Secure-token=${
            encodeURIComponent(body.refresh.token)
          }; Domain=${
            process.env.COGNITO_IDENTITY_POOL_PROVIDER!
          }; Path=/${
            process.env.API_BASE_PATH!
          }/authenticate; Expires=${
            new Date(Date.parse(body.refresh.expires)).toUTCString()
          }; HttpOnly; Secure; SameSite=Strict`)
      })

    /* Test: should return identity token for valid refresh token */
    it("should return identity token for valid refresh token", async () => {
      const { body: { refresh } } = await request.post("/authenticate")
        .set("Content-Type", "application/json")
        .send({ username: email, password, remember: true })
        .expect(200)
      const { body } = await request.post("/authenticate")
        .send({ token: refresh.token })
        .expect(200)
      expect(body.id.token)
        .toMatch(/^([a-zA-Z0-9\-_]+\.){2}[a-zA-Z0-9\-_]+$/)
      expect(Date.parse(body.id.expires))
        .toBeGreaterThanOrEqual(Date.now() + 1000 * 59 * 60)
    })

    /* Test: should return access token for valid refresh token */
    it("should return access token for valid refresh token", async () => {
      const { body: { refresh } } = await request.post("/authenticate")
        .set("Content-Type", "application/json")
        .send({ username: email, password, remember: true })
        .expect(200)
      const { body } = await request.post("/authenticate")
        .send({ token: refresh.token })
        .expect(200)
      expect(body.access.token)
        .toMatch(/^([a-zA-Z0-9\-_]+\.){2}[a-zA-Z0-9\-_]+$/)
      expect(Date.parse(body.access.expires))
        .toBeGreaterThanOrEqual(Date.now() + 1000 * 59 * 60)
    })

    /* Test: should return error for invalid credentials */
    it("should return error for invalid credentials", () => {
      return request.post("/authenticate")
        .set("Content-Type", "application/json")
        .send({ username: email, password: chance.string() })
        .expect(400, {
          type: "NotAuthorizedException",
          message: "Incorrect username or password"
        })
    })
  })
})
