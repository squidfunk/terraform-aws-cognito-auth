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

import { handler } from "~/index"
import { VerificationContext } from "~/verification"

import { chance } from "_/helpers"
import {
  mockMessageComposeWithError,
  mockMessageComposeWithResult
} from "_/mocks/messages"
import { mockSNSEvent } from "_/mocks/vendor/aws-lambda"
import {
  mockCognitoAdminGetUserWithError,
  mockCognitoAdminGetUserWithResult,
  restoreCognitoAdminGetUser
} from "_/mocks/vendor/aws-sdk/cognito"
import {
  mockSESSendRawEmailWithError,
  mockSESSendRawEmailWithSuccess,
  restoreSESSendRawEmail
} from "_/mocks/vendor/aws-sdk/ses"
import { mockVerificationCode } from "_/mocks/verification"

/* ----------------------------------------------------------------------------
 * Tests
 * ------------------------------------------------------------------------- */

/* Lambda handler */
describe("handler", () => {

  /* Verification code and SNS event */
  const code  = mockVerificationCode()
  const event = mockSNSEvent(code)

  /* Restore AWS mocks */
  afterEach(() => {
    restoreCognitoAdminGetUser()
    restoreSESSendRawEmail()
  })

  /* Test: should resolve with no result */
  it("should resolve with no result", async () => {
    mockCognitoAdminGetUserWithResult()
    mockMessageComposeWithResult()
    mockSESSendRawEmailWithSuccess()
    expect(await handler(event)).toBeUndefined()
  })

  /* Test: should retrieve user from AWS Cognito */
  it("should retrieve user from AWS Cognito", async () => {
    const adminGetUserMock = mockCognitoAdminGetUserWithResult()
    mockMessageComposeWithResult()
    mockSESSendRawEmailWithSuccess()
    await handler(event)
    expect(adminGetUserMock).toHaveBeenCalledWith({
      UserPoolId: process.env.COGNITO_USER_POOL!,
      Username: code.subject
    })
  })

  /* Test: should send message via AWS SNS */
  it("should send message via AWS SNS", async () => {
    const email = chance.email()
    mockCognitoAdminGetUserWithResult(chance.string(), email)
    mockMessageComposeWithResult()
    const sendRawEmailMock = mockSESSendRawEmailWithSuccess()
    await handler(event)
    expect(sendRawEmailMock).toHaveBeenCalledWith({
      Source: process.env.SES_SENDER_ADDRESS!,
      Destinations: [email],
      RawMessage: {
        Data: jasmine.any(String)
      }
    })
  })

  /* Test: should swallow message for example.com domain */
  it("should swallow message for example.com domain", async () => {
    const email = chance.email({ domain: "example.com"})
    mockCognitoAdminGetUserWithResult(chance.string(), email)
    mockMessageComposeWithResult()
    const sendRawEmailMock = mockSESSendRawEmailWithSuccess()
    await handler(event)
    expect(sendRawEmailMock).not.toHaveBeenCalled()
  })

  /* Test: should compose registration verification message */
  it("should compose registration verification message", async () => {
    mockCognitoAdminGetUserWithResult()
    const composeMock = mockMessageComposeWithResult()
    mockSESSendRawEmailWithSuccess()
    await handler(mockSNSEvent(mockVerificationCode("register")))
    expect(composeMock).toHaveBeenCalled()
  })

  /* Test: should compose reset verification message */
  it("should compose reset verification message", async () => {
    mockCognitoAdminGetUserWithResult()
    const composeMock = mockMessageComposeWithResult()
    mockSESSendRawEmailWithSuccess()
    await handler(mockSNSEvent(mockVerificationCode("reset")))
    expect(composeMock).toHaveBeenCalled()
  })

  /* Test: should reject on invalid verification context */
  it("should reject on invalid verification context", async done => {
    const context = chance.string() as VerificationContext
    mockCognitoAdminGetUserWithResult()
    mockMessageComposeWithResult()
    mockSESSendRawEmailWithSuccess()
    try {
      await handler(mockSNSEvent(mockVerificationCode(context)))
      done.fail()
    } catch (err) {
      expect(err)
        .toEqual(new Error(`Invalid verification context: "${context}"`))
      done()
    }
  })

  /* Test: should reject on compose error */
  it("should reject on compose error", async done => {
    const errMock = new Error()
    mockCognitoAdminGetUserWithResult()
    mockMessageComposeWithError(errMock)
    mockSESSendRawEmailWithSuccess()
    try {
      await handler(event)
      done.fail()
    } catch (err) {
      expect(err).toBe(errMock)
      done()
    }
  })

  /* Test: should reject on AWS Cognito error */
  it("should reject on AWS Cognito error", async done => {
    const errMock = new Error()
    mockCognitoAdminGetUserWithError(errMock)
    mockMessageComposeWithResult()
    mockSESSendRawEmailWithSuccess()
    try {
      await handler(event)
      done.fail()
    } catch (err) {
      expect(err).toBe(errMock)
      done()
    }
  })

  /* Test: should reject on AWS SES error */
  it("should reject on AWS SES error", async done => {
    const errMock = new Error()
    mockCognitoAdminGetUserWithResult()
    mockMessageComposeWithResult()
    mockSESSendRawEmailWithError(errMock)
    try {
      await handler(event)
      done.fail()
    } catch (err) {
      expect(err).toBe(errMock)
      done()
    }
  })
})
