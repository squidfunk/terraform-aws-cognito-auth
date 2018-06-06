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

import { Verification } from "~/verification"

import { chance } from "_/helpers"
import {
  mockDynamoDBDocumentClientDeleteWithError,
  mockDynamoDBDocumentClientDeleteWithoutResult,
  mockDynamoDBDocumentClientDeleteWithResult,
  mockDynamoDBDocumentClientPutWithError,
  mockDynamoDBDocumentClientPutWithSuccess,
  restoreDynamoDBDocumentClientDelete,
  restoreDynamoDBDocumentClientPut
} from "_/mocks/vendor/aws-sdk/dynamodb"
import {
  mockSNSPublishWithError,
  mockSNSPublishWithSuccess,
  restoreSNSPublish
} from "_/mocks/vendor/aws-sdk/sns"
import {
  mockVerificationCode,
  mockVerificationContext
} from "_/mocks/verification"

/* ----------------------------------------------------------------------------
 * Tests
 * ------------------------------------------------------------------------- */

/* Verification */
describe("verification", () => {

  /* Verification */
  describe("Verification", () => {

    /* #issue */
    describe("#issue", () => {

      /* Restore AWS mocks */
      afterEach(() => {
        restoreDynamoDBDocumentClientPut()
        restoreSNSPublish()
      })

      /* Verification subject and context */
      const subject = chance.guid()
      const context = mockVerificationContext()

      /* Test: should resolve with verification code */
      it("should resolve with verification code", async () => {
        mockDynamoDBDocumentClientPutWithSuccess()
        mockSNSPublishWithSuccess()
        const verification = new Verification()
        const code = await verification.issue(context, subject)
        expect(code.id).toMatch(/^[a-f0-9]{32}$/)
        expect(code.context).toEqual(context)
        expect(code.subject).toEqual(subject)
        expect(code.expires).toBeGreaterThan(0)
      })

      /* Test: should set expiry date to 24 hours from now */
      it("should set expiry date to 24 hours from now", async () => {
        mockDynamoDBDocumentClientPutWithSuccess()
        mockSNSPublishWithSuccess()
        const verification = new Verification()
        const code = await verification.issue(context, subject)
        expect(code.expires)
          .toBeGreaterThanOrEqual(Math.floor(Date.now() / 1000) + 59 * 60 * 24)
      })

      /* Test: should store verification code in AWS DynamoDB */
      it("should store verification code in AWS DynamoDB", async () => {
        const putMock = mockDynamoDBDocumentClientPutWithSuccess()
        mockSNSPublishWithSuccess()
        const verification = new Verification()
        const code = await verification.issue(context, subject)
        expect(putMock).toHaveBeenCalledWith({
          TableName: jasmine.any(String),
          Item: code
        })
      })

      /* Test: should publish verification code via AWS SNS */
      it("should publish verification code via AWS SNS", async () => {
        mockDynamoDBDocumentClientPutWithSuccess()
        const publishMock = mockSNSPublishWithSuccess()
        const verification = new Verification()
        const code = await verification.issue(context, subject)
        expect(publishMock).toHaveBeenCalledWith({
          TopicArn: jasmine.any(String),
          Message: JSON.stringify({
            default: "",
            ...code
          }),
          MessageStructure: "json"
        })
      })

      /* Test: should reject on AWS DynamoDB error */
      it("should reject on AWS DynamoDB error", async done => {
        const errMock = new Error()
        const putMock = mockDynamoDBDocumentClientPutWithError(errMock)
        mockSNSPublishWithSuccess()
        try {
          const verification = new Verification()
          await verification.issue(context, subject)
          done.fail()
        } catch (err) {
          expect(putMock).toHaveBeenCalled()
          expect(err).toBe(errMock)
          done()
        }
      })

      /* Test: should reject on AWS SNS error */
      it("should reject on AWS SNS error", async done => {
        const errMock = new Error()
        mockDynamoDBDocumentClientPutWithSuccess()
        const publishMock = mockSNSPublishWithError(errMock)
        try {
          const verification = new Verification()
          await verification.issue(context, subject)
          done.fail()
        } catch (err) {
          expect(publishMock).toHaveBeenCalled()
          expect(err).toBe(errMock)
          done()
        }
      })
    })

    /* #claim */
    describe("#claim", () => {

      /* Restore AWS mocks */
      afterEach(() => {
        restoreDynamoDBDocumentClientDelete()
      })

      /* Verification code */
      const code = mockVerificationCode()

      /* Test: should resolve with verification code */
      it("should resolve with verification code", async () => {
        mockDynamoDBDocumentClientDeleteWithResult(code)
        const verification = new Verification()
        expect(await verification.claim(code.context, code.id))
          .toEqual(code)
      })

      /* Test: should delete verification code from DynamoDB */
      it("should delete verification code from DynamoDB", async () => {
        const deleteMock = mockDynamoDBDocumentClientDeleteWithResult(code)
        const verification = new Verification()
        await verification.claim(code.context, code.id)
        expect(deleteMock).toHaveBeenCalledWith({
          TableName: jasmine.any(String),
          Key: { id: code.id },
          ReturnValues: "ALL_OLD"
        })
      })

      /* Test: should reject on invalid verification code */
      it("should reject on invalid verification code", async done => {
        const deleteMock = mockDynamoDBDocumentClientDeleteWithoutResult()
        try {
          const verification = new Verification()
          await verification.claim(code.context, code.id)
          done.fail()
        } catch (err) {
          expect(deleteMock).toHaveBeenCalled()
          expect(err).toEqual(new Error("Invalid verification code"))
          done()
        }
      })

      /* Test: should reject on invalid verification context */
      it("should reject on invalid verification context", async done => {
        const deleteMock =
          mockDynamoDBDocumentClientDeleteWithResult(
            mockVerificationCode("register"))
        try {
          const verification = new Verification()
          await verification.claim("reset", code.id)
          done.fail()
        } catch (err) {
          expect(deleteMock).toHaveBeenCalled()
          expect(err).toEqual(new Error("Invalid verification code"))
          done()
        }
      })

      /* Test: should reject on AWS DynamoDB error */
      it("should reject on AWS DynamoDB error", async done => {
        const errMock = new Error()
        const deleteMock = mockDynamoDBDocumentClientDeleteWithError(errMock)
        try {
          const verification = new Verification()
          await verification.claim(code.context, code.id)
          done.fail()
        } catch (err) {
          expect(deleteMock).toHaveBeenCalled()
          expect(err).toBe(errMock)
          done()
        }
      })
    })
  })
})
