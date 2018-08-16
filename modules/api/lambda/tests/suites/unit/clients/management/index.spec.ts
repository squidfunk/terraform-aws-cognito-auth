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

import { ManagementClient } from "clients/management"

import { chance } from "_/helpers"
import { mockResetVerifyRequest } from "_/mocks/common"
import {
  mockCognitoAdminConfirmSignUpWithError,
  mockCognitoAdminConfirmSignUpWithSuccess,
  mockCognitoAdminDeleteUserWithError,
  mockCognitoAdminDeleteUserWithSuccess,
  mockCognitoAdminGetUserWithError,
  mockCognitoAdminGetUserWithResult,
  mockCognitoAdminUpdateUserAttributesWithError,
  mockCognitoAdminUpdateUserAttributesWithSuccess,
  mockCognitoSignUpWithError,
  mockCognitoSignUpWithSuccess,
  restoreCognitoAdminConfirmSignUp,
  restoreCognitoAdminDeleteUser,
  restoreCognitoAdminGetUser,
  restoreCognitoAdminUpdateUserAttributes,
  restoreCognitoSignUp
} from "_/mocks/vendor/aws-sdk"

/* ----------------------------------------------------------------------------
 * Tests
 * ------------------------------------------------------------------------- */

/* Management client */
describe("clients/management", () => {

  /* ManagementClient */
  describe("ManagementClient", () => {

    /* User */
    const username = chance.string()

    /* #verifyUser */
    describe("#verifyUser", () => {

      /* Restore AWS mocks */
      afterEach(() => {
        restoreCognitoAdminConfirmSignUp()
        restoreCognitoAdminUpdateUserAttributes()
      })

      /* Test: should resolve with no result */
      it("should resolve with no result", async () => {
        mockCognitoAdminConfirmSignUpWithSuccess()
        mockCognitoAdminUpdateUserAttributesWithSuccess()
        const mgmt = new ManagementClient()
        expect(await mgmt.verifyUser(username))
          .toBeUndefined()
      })

      /* Test: should confirm user registration */
      it("should confirm user registration", async () => {
        const adminConfirmSignUpMock =
          mockCognitoAdminConfirmSignUpWithSuccess()
        mockCognitoAdminUpdateUserAttributesWithSuccess()
        const mgmt = new ManagementClient()
        await mgmt.verifyUser(username)
        expect(adminConfirmSignUpMock).toHaveBeenCalled()
      })

      /* Test: should confirm user email address */
      it("should verify user email address", async () => {
        mockCognitoAdminConfirmSignUpWithSuccess()
        const adminUpdateUserAttributesMock =
          mockCognitoAdminUpdateUserAttributesWithSuccess()
        const mgmt = new ManagementClient()
        await mgmt.verifyUser(username)
        expect(adminUpdateUserAttributesMock).toHaveBeenCalled()
      })

      /* Test: should reject on AWS Cognito error (confirm sign up) */
      it ("should reject on AWS Cognito error (confirm sign up)",
        async done => {
          const errMock = new Error()
          const adminConfirmSignUpMock =
            mockCognitoAdminConfirmSignUpWithError(errMock)
          mockCognitoAdminUpdateUserAttributesWithSuccess()
          try {
            const mgmt = new ManagementClient()
            await mgmt.verifyUser(username)
            done.fail()
          } catch (err) {
            expect(adminConfirmSignUpMock).toHaveBeenCalled()
            expect(err).toBe(errMock)
            done()
          }
        })

      /* Test: should reject on AWS Cognito error (update attributes) */
      it ("should reject on AWS Cognito error (update attributes)",
        async done => {
          const errMock = new Error()
          mockCognitoAdminConfirmSignUpWithSuccess()
          const adminUpdateUserAttributesMock =
            mockCognitoAdminUpdateUserAttributesWithError(errMock)
          try {
            const mgmt = new ManagementClient()
            await mgmt.verifyUser(username)
            done.fail()
          } catch (err) {
            expect(adminUpdateUserAttributesMock).toHaveBeenCalled()
            expect(err).toBe(errMock)
            done()
          }
        })
    })

    /* #deleteUser */
    describe("#deleteUser", () => {

      /* Restore AWS mocks */
      afterEach(() => {
        restoreCognitoAdminDeleteUser()
      })

      /* Test: should resolve with no result */
      it("should resolve with no result", async () => {
        mockCognitoAdminDeleteUserWithSuccess()
        const mgmt = new ManagementClient()
        expect(await mgmt.deleteUser(username))
          .toBeUndefined()
      })

      /* Test: should reject on AWS Cognito error */
      it ("should reject on AWS Cognito error",
        async done => {
          const errMock = new Error()
          const adminDeleteUserMock =
            mockCognitoAdminDeleteUserWithError(errMock)
          try {
            const mgmt = new ManagementClient()
            await mgmt.deleteUser(username)
            done.fail()
          } catch (err) {
            expect(adminDeleteUserMock).toHaveBeenCalled()
            expect(err).toBe(errMock)
            done()
          }
        })
    })

    /* #changePassword */
    describe("#changePassword", () => {

      /* Password */
      const { password } = mockResetVerifyRequest()

      /* Restore AWS mocks */
      afterEach(() => {
        restoreCognitoAdminGetUser()
        restoreCognitoAdminDeleteUser()
        restoreCognitoSignUp()
        restoreCognitoAdminConfirmSignUp()
        restoreCognitoAdminUpdateUserAttributes()
      })

      /* Test: should resolve with no result */
      it("should resolve with no result", async () => {
        mockCognitoAdminGetUserWithResult()
        mockCognitoAdminDeleteUserWithSuccess()
        mockCognitoSignUpWithSuccess()
        mockCognitoAdminConfirmSignUpWithSuccess()
        mockCognitoAdminUpdateUserAttributesWithSuccess()
        const mgmt = new ManagementClient()
        expect(await mgmt.changePassword(username, password))
          .toBeUndefined()
      })

      /* Test: should retrieve and delete old user */
      it("should retrieve and delete old user", async () => {
        mockCognitoAdminGetUserWithResult(username)
        const adminDeleteUserMock = mockCognitoAdminDeleteUserWithSuccess()
        mockCognitoSignUpWithSuccess()
        mockCognitoAdminConfirmSignUpWithSuccess()
        mockCognitoAdminUpdateUserAttributesWithSuccess()
        const mgmt = new ManagementClient()
        await mgmt.changePassword(username, password)
        expect(adminDeleteUserMock).toHaveBeenCalledWith(
          jasmine.objectContaining({
            Username: username
          }))
      })

      /* Test: should register and verify new user */
      it("should register and verify new user", async () => {
        mockCognitoAdminGetUserWithResult(username)
        mockCognitoAdminDeleteUserWithSuccess()
        const signUpMock = mockCognitoSignUpWithSuccess()
        const adminConfirmSignUpMock =
          mockCognitoAdminConfirmSignUpWithSuccess()
        const adminUpdateUserAttributesMock =
          mockCognitoAdminUpdateUserAttributesWithSuccess()
        const mgmt = new ManagementClient()
        await mgmt.changePassword(username, password)
        expect(signUpMock).toHaveBeenCalledWith(
          jasmine.objectContaining({
            Username: username,
            Password: password,
            UserAttributes: [
              {
                Name: "email",
                Value: jasmine.any(String)
              }
            ]
          }))
        expect(adminConfirmSignUpMock).toHaveBeenCalledWith(
          jasmine.objectContaining({
            Username: username
          }))
        expect(adminUpdateUserAttributesMock).toHaveBeenCalledWith(
          jasmine.objectContaining({
            Username: username,
            UserAttributes: [
              {
                Name: "email_verified",
                Value: "true"
              }
            ]
          }))
      })

      /* Test: should reject on AWS Cognito error (get user) */
      it("should reject on AWS Cognito error (get user)", async done => {
        const errMock = new Error()
        const adminGetUserMock = mockCognitoAdminGetUserWithError(errMock)
        mockCognitoAdminDeleteUserWithSuccess()
        mockCognitoSignUpWithSuccess()
        mockCognitoAdminConfirmSignUpWithSuccess()
        mockCognitoAdminUpdateUserAttributesWithSuccess()
        try {
          const mgmt = new ManagementClient()
          await mgmt.changePassword(username, password)
          done.fail()
        } catch (err) {
          expect(adminGetUserMock).toHaveBeenCalled()
          expect(err).toBe(errMock)
          done()
        }
      })

      /* Test: should reject on AWS Cognito error (delete user) */
      it("should reject on AWS Cognito error (delete user)", async done => {
        const errMock = new Error()
        mockCognitoAdminGetUserWithResult()
        const adminDeleteUserMock =
          mockCognitoAdminDeleteUserWithError(errMock)
        mockCognitoSignUpWithSuccess()
        mockCognitoAdminConfirmSignUpWithSuccess()
        mockCognitoAdminUpdateUserAttributesWithSuccess()
        try {
          const mgmt = new ManagementClient()
          await mgmt.changePassword(username, password)
          done.fail()
        } catch (err) {
          expect(adminDeleteUserMock).toHaveBeenCalled()
          expect(err).toBe(errMock)
          done()
        }
      })

      /* Test: should reject on AWS Cognito error (sign up) */
      it("should reject on AWS Cognito error (sign up)", async done => {
        const errMock = new Error()
        mockCognitoAdminGetUserWithResult()
        mockCognitoAdminDeleteUserWithSuccess()
        const signUpMock = mockCognitoSignUpWithError(errMock)
        mockCognitoAdminConfirmSignUpWithSuccess()
        mockCognitoAdminUpdateUserAttributesWithSuccess()
        try {
          const mgmt = new ManagementClient()
          await mgmt.changePassword(username, password)
          done.fail()
        } catch (err) {
          expect(signUpMock).toHaveBeenCalled()
          expect(err).toBe(errMock)
          done()
        }
      })

      /* Test: should reject on AWS Cognito error (confirm sign up) */
      it("should reject on AWS Cognito error (confirm sign up)",
        async done => {
          const errMock = new Error()
          mockCognitoAdminGetUserWithResult()
          mockCognitoAdminDeleteUserWithSuccess()
          mockCognitoSignUpWithSuccess()
          const adminConfirmSignUpMock =
            mockCognitoAdminConfirmSignUpWithError(errMock)
          mockCognitoAdminUpdateUserAttributesWithSuccess()
          try {
            const mgmt = new ManagementClient()
            await mgmt.changePassword(username, password)
            done.fail()
          } catch (err) {
            expect(adminConfirmSignUpMock).toHaveBeenCalled()
            expect(err).toBe(errMock)
            done()
          }
        })

      /* Test: should reject on AWS Cognito error (update attributes) */
      it("should reject on AWS Cognito error (update attributes)",
        async done => {
          const errMock = new Error()
          mockCognitoAdminGetUserWithResult()
          mockCognitoAdminDeleteUserWithSuccess()
          mockCognitoSignUpWithSuccess()
          mockCognitoAdminConfirmSignUpWithSuccess()
          const adminUpdateUserAttributesMock =
            mockCognitoAdminUpdateUserAttributesWithError(errMock)
          try {
            const mgmt = new ManagementClient()
            await mgmt.changePassword(username, password)
            done.fail()
          } catch (err) {
            expect(adminUpdateUserAttributesMock).toHaveBeenCalled()
            expect(err).toBe(errMock)
            done()
          }
        })
    })
  })
})
