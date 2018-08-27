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

import { SessionClient } from "clients/session"

import { chance } from "_/helpers"
import {
  mockCognitoGlobalSignOutWithError,
  mockCognitoGlobalSignOutWithSuccess,
  restoreCognitoGlobalSignOut
} from "_/mocks/vendor/aws-sdk"

/* ----------------------------------------------------------------------------
 * Tests
 * ------------------------------------------------------------------------- */

/* Session client */
describe("clients/session", () => {

  /* SessionClient */
  describe("SessionClient", () => {

    /* #signOut */
    describe("#signOut", () => {

      /* Access token */
      const token = chance.string({ length: 128 })

      /* Restore AWS mocks */
      afterEach(() => {
        restoreCognitoGlobalSignOut()
      })

      /* Test: should resolve with no result */
      it("should resolve with no result", async () => {
        mockCognitoGlobalSignOutWithSuccess()
        const session = new SessionClient(token)
        expect(await session.signOut())
          .toBeUndefined()
      })

      /* Test: should sign out user */
      it("should sign out user", async () => {
        const globalSignOutMock = mockCognitoGlobalSignOutWithSuccess()
        const session = new SessionClient(token)
        await session.signOut()
        expect(globalSignOutMock).toHaveBeenCalledWith({
          AccessToken: token
        })
      })

      /* Test: should reject on AWS Cognito error */
      it("should reject on AWS Cognito error", async done => {
        const errMock = new Error()
        const globalSignOutMock = mockCognitoGlobalSignOutWithError(errMock)
        try {
          const session = new SessionClient(token)
          await session.signOut()
          done.fail()
        } catch (err) {
          expect(globalSignOutMock).toHaveBeenCalled()
          expect(err).toBe(errMock)
          done()
        }
      })
    })
  })
})
