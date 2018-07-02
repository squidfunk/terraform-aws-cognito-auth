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

import { AWSError } from "aws-sdk"

import { AuthenticationClient, translate } from "clients/authentication"

import { chance } from "_/helpers"
import {
  mockAuthenticateRequestWithCredentials,
  mockAuthenticateRequestWithToken
} from "_/mocks/common/events/authenticate"
import { mockRegisterRequest } from "_/mocks/common/events/register"
import { mockResetRequest } from "_/mocks/common/events/reset"
import {
  mockCognitoAdminGetUserWithError,
  mockCognitoAdminGetUserWithResult,
  mockCognitoInitiateAuthWithChallenge,
  mockCognitoInitiateAuthWithCredentials,
  mockCognitoInitiateAuthWithError,
  mockCognitoInitiateAuthWithToken,
  mockCognitoSignUpWithError,
  mockCognitoSignUpWithSuccess,
  restoreCognitoAdminGetUser,
  restoreCognitoInitiateAuth,
  restoreCognitoSignUp
} from "_/mocks/vendor/aws-sdk/cognito"
import {
  mockVerificationCode,
  mockVerificationIssueWithError,
  mockVerificationIssueWithResult
} from "_/mocks/verification"

/* ----------------------------------------------------------------------------
 * Tests
 * ------------------------------------------------------------------------- */

/* Authentication client */
describe("clients/authentication", () => {

  /* Error translation */
  describe("translate", () => {

    /* Test: should translate empty username and password error */
    it("should translate empty username and password error", () => {
      expect(translate({
        code: "InvalidParameterException",
        message: chance.string()
      } as AWSError))
        .toEqual({
          code: "TypeError",
          message: "Invalid request"
        } as AWSError)
    })

    /* Test: should translate invalid username error */
    it("should translate invalid username error", () => {
      expect(translate({
        code: "UserNotFoundException",
        message: chance.string()
      } as AWSError))
        .toEqual({
          code: "NotAuthorizedException",
          message: "Incorrect username or password"
        } as AWSError)
    })

    /* Test: should pass-through all other errors */
    it("should pass-through all other errors", () => {
      const message = chance.string()
      const err = { code: chance.string(), message } as AWSError
      expect(translate(err)).toBe(err)
    })
  })

  /* AuthenticationClient */
  describe("AuthenticationClient", () => {

    /* #register */
    describe("#register", () => {

      /* Registration request and verification code */
      const { email, password } = mockRegisterRequest()
      const code = mockVerificationCode()

      /* Restore AWS mocks */
      afterEach(() => {
        restoreCognitoSignUp()
      })

      /* Test: should resolve with verification code */
      it("should resolve with verification code", async () => {
        mockCognitoSignUpWithSuccess()
        mockVerificationIssueWithResult(code)
        const auth = new AuthenticationClient()
        expect(await auth.register(email, password))
          .toEqual(code)
      })

      /* Test: should set username to random uuid */
      it("should set username to random uuid", async () => {
        const signUpMock = mockCognitoSignUpWithSuccess()
        mockVerificationIssueWithResult()
        const auth = new AuthenticationClient()
        await auth.register(email, password)
        expect(signUpMock).toHaveBeenCalledWith(
          jasmine.objectContaining({
            Username: jasmine.stringMatching(
              /^[\w]{8}-[\w]{4}-[\w]{4}-[\w]{4}-[\w]{12}$/
            )
          }))
      })

      /* Test: should set password */
      it("should set password", async () => {
        const signUpMock = mockCognitoSignUpWithSuccess()
        mockVerificationIssueWithResult()
        const auth = new AuthenticationClient()
        await auth.register(email, password)
        expect(signUpMock).toHaveBeenCalledWith(
          jasmine.objectContaining({
            Password: password
          }))
      })

      /* Test: should set email as attribute */
      it("should set email as attribute", async () => {
        const signUpMock = mockCognitoSignUpWithSuccess()
        mockVerificationIssueWithResult()
        const auth = new AuthenticationClient()
        await auth.register(email, password)
        expect(signUpMock).toHaveBeenCalledWith(
          jasmine.objectContaining({
            UserAttributes: jasmine.arrayContaining([
              {
                Name: "email",
                Value: email
              }
            ])
          }))
      })

      /* Test: should reject on verification error */
      it ("should reject on verification error", async done => {
        const errMock = new Error()
        mockCognitoSignUpWithSuccess()
        const issueMock = mockVerificationIssueWithError(errMock)
        try {
          const auth = new AuthenticationClient()
          await auth.register(email, password)
          done.fail()
        } catch (err) {
          expect(issueMock).toHaveBeenCalled()
          expect(err).toBe(errMock)
          done()
        }
      })

      /* Test: should reject on AWS Cognito error */
      it ("should reject on AWS Cognito error", async done => {
        const errMock = new Error()
        const signUpMock = mockCognitoSignUpWithError(errMock)
        mockVerificationIssueWithResult()
        try {
          const auth = new AuthenticationClient()
          await auth.register(email, password)
          done.fail()
        } catch (err) {
          expect(signUpMock).toHaveBeenCalled()
          expect(err).toBe(errMock)
          done()
        }
      })
    })

    /* #authenticate */
    describe("#authenticate", () => {

      /* Authentication requests */
      const { username, password } = mockAuthenticateRequestWithCredentials()
      const { token } = mockAuthenticateRequestWithToken()

      /* Restore AWS mocks */
      afterEach(() => {
        restoreCognitoInitiateAuth()
      })

      /* Test: should resolve with access token for valid credentials */
      it("should resolve with access token for valid credentials",
        async () => {
          mockCognitoInitiateAuthWithCredentials()
          const auth = new AuthenticationClient()
          const { access } = await auth.authenticate(username, password)
          expect(access.token).toEqual(jasmine.any(String))
          expect(access.expires)
            .toBeGreaterThan(Date.now() + 1000 * 59 * 60)
        })

      /* Test: should resolve with refresh token for valid credentials */
      it("should resolve with refresh token for valid credentials",
        async () => {
          mockCognitoInitiateAuthWithCredentials()
          const auth = new AuthenticationClient()
          const { refresh } = await auth.authenticate(username, password)
          expect(refresh!.token).toEqual(jasmine.any(String))
          expect(refresh!.expires)
            .toBeGreaterThan(Date.now() + 1000 * 59 * 60 * 24 * 30)
        })

      /* Test: should resolve with access token for valid refresh token */
      it("should resolve with access token for valid refresh token",
        async () => {
          mockCognitoInitiateAuthWithToken()
          const auth = new AuthenticationClient()
          const { access, refresh } = await auth.authenticate(token)
          expect(access.token).toEqual(jasmine.any(String))
          expect(access.expires)
            .toBeGreaterThan(Date.now() + 1000 * 59 * 60)
          expect(refresh).toBeUndefined()
        })

      /* Test: should reject on challenge for valid credentials */
      it("should reject on challenge for valid credentials",
        async done => {
          const challenge = chance.string()
          const initiateAuthMock =
            mockCognitoInitiateAuthWithChallenge(challenge)
          try {
            const auth = new AuthenticationClient()
            await auth.authenticate(username, password)
            done.fail()
          } catch (err) {
            expect(initiateAuthMock).toHaveBeenCalled()
            expect(err).toEqual(
              new Error(`Invalid authentication: challenge "${challenge}"`))
            done()
          }
        })

      /* Test: should reject on challenge for valid refresh token */
      it("should reject on challenge for valid refresh token",
        async done => {
          const challenge = chance.string()
          const initiateAuthMock =
            mockCognitoInitiateAuthWithChallenge(challenge)
          try {
            const auth = new AuthenticationClient()
            await auth.authenticate(token)
            done.fail()
          } catch (err) {
            expect(initiateAuthMock).toHaveBeenCalled()
            expect(err).toEqual(
              new Error(`Invalid authentication: challenge "${challenge}"`))
            done()
          }
        })

      /* Test: should reject on AWS Cognito error (credentials) */
      it("should reject on AWS Cognito error (credentials)",
        async done => {
          const errMock = new Error()
          const initiateAuthMock =
            mockCognitoInitiateAuthWithError(errMock)
          try {
            const auth = new AuthenticationClient()
            await auth.authenticate(username, password)
            done.fail()
          } catch (err) {
            expect(initiateAuthMock).toHaveBeenCalled()
            expect(err).toBe(errMock)
            done()
          }
        })

      /* Test: should reject on AWS Cognito error (refresh token) */
      it("should reject on AWS Cognito error (refresh token)",
        async done => {
          const errMock = new Error()
          const initiateAuthMock =
            mockCognitoInitiateAuthWithError(errMock)
          try {
            const auth = new AuthenticationClient()
            await auth.authenticate(token)
            done.fail()
          } catch (err) {
            expect(initiateAuthMock).toHaveBeenCalled()
            expect(err).toBe(errMock)
            done()
          }
        })
    })

    /* #forgotPassword */
    describe("#forgotPassword", () => {

      /* Reset requests and verification code */
      const { username } = mockResetRequest()
      const code = mockVerificationCode()

      /* Restore AWS mocks */
      afterEach(() => {
        restoreCognitoAdminGetUser()
      })

      /* Test: should resolve with verification code */
      it("should resolve with verification code", async () => {
        mockCognitoAdminGetUserWithResult()
        mockVerificationIssueWithResult(code)
        const auth = new AuthenticationClient()
        expect(await auth.forgotPassword(username))
          .toEqual(code)
      })

      /* Test: should reject on verification error */
      it ("should reject on verification error", async done => {
        const errMock = new Error()
        mockCognitoAdminGetUserWithResult()
        const issueMock = mockVerificationIssueWithError(errMock)
        try {
          const auth = new AuthenticationClient()
          await auth.forgotPassword(username)
          done.fail()
        } catch (err) {
          expect(issueMock).toHaveBeenCalled()
          expect(err).toBe(errMock)
          done()
        }
      })

      /* Test: should reject on AWS Cognito error */
      it ("should reject on AWS Cognito error", async done => {
        const errMock = new Error()
        const adminGetUserMock = mockCognitoAdminGetUserWithError(errMock)
        mockVerificationIssueWithResult()
        try {
          const auth = new AuthenticationClient()
          await auth.forgotPassword(username)
          done.fail()
        } catch (err) {
          expect(adminGetUserMock).toHaveBeenCalled()
          expect(err).toBe(errMock)
          done()
        }
      })
    })
  })
})
