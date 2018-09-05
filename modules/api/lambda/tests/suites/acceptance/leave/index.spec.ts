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

import { chance, request, wait } from "_/helpers"
import { mockRegisterRequest } from "_/mocks/common"

/* ----------------------------------------------------------------------------
 * Tests
 * ------------------------------------------------------------------------- */

/* Authentication leave */
describe("POST /leave", () => {

  /* Authentication and management client */
  const auth = new AuthenticationClient()
  const mgmt = new ManagementClient()

  /* Test: should return error for missing authentication header */
  it("should return error for missing authentication header", () => {
    return request.post("/leave")
      .expect(400)
  })

  /* Test: should return error for invalid authentication header */
  it("should return error for invalid authentication header", () => {
    return request.get("/check")
      .set("Authorization", chance.string())
      .expect(403)
  })

  /* with authenticated user */
  describe("with authenticated user", () => {

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
    it("should return empty body", async () => {
      const { body } =  await request.post("/authenticate")
        .set("Content-Type", "application/json")
        .send({ username: email, password })
      wait(2000) // busy-wait for synchronization
      return request.post("/leave")
        .set("Authorization", `Bearer ${body.access.token}`)
        .expect(204, "")
    })

    /* Test: should invalidate cookie for valid token */
    it("should invalidate cookie for valid token", async () => {
      const { body } =  await request.post("/authenticate")
        .set("Content-Type", "application/json")
        .send({ username: email, password })
      wait(2000) // busy-wait for synchronization
      const { header } = await request.post("/leave")
        .set("Authorization", `Bearer ${body.access.token}`)
        .expect(204, "")
      expect(header["set-cookie"]).toMatch(
        `__Secure-token=; Domain=${
          process.env.COGNITO_IDENTITY_POOL_PROVIDER!
        }; Path=/${
          process.env.API_BASE_PATH!
        }/authenticate; Expires=${
          new Date(0).toUTCString()
        }; HttpOnly; Secure; SameSite=Strict`)
    })

    /* Test: should invalidate cookie for invalid token */
    it("should invalidate cookie for invalid token", async () => {
      const { header } = await request.post("/leave")
        .set("Authorization", `Bearer ${chance.string()}`)
        .expect(400)
      expect(header["set-cookie"]).toMatch(
        `__Secure-token=; Domain=${
          process.env.COGNITO_IDENTITY_POOL_PROVIDER!
        }; Path=/${
          process.env.API_BASE_PATH!
        }/authenticate; Expires=${
          new Date(0).toUTCString()
        }; HttpOnly; Secure; SameSite=Strict`)
    })

    /* Test: should invalidate cookie for missing token */
    it("should invalidate cookie for missing token", async () => {
      const { header } = await request.post("/leave")
        .expect(400)
      expect(header["set-cookie"]).toMatch(
        `__Secure-token=; Domain=${
          process.env.COGNITO_IDENTITY_POOL_PROVIDER!
        }; Path=/${
          process.env.API_BASE_PATH!
        }/authenticate; Expires=${
          new Date(0).toUTCString()
        }; HttpOnly; Secure; SameSite=Strict`)
    })
  })
})
