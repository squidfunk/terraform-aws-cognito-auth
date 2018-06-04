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

import * as _ from "aws-sdk"

import { VerificationCode } from "~/verification"

import { mockVerificationCode } from "_/mocks/verification"

/* ----------------------------------------------------------------------------
 * Functions
 * ------------------------------------------------------------------------- */

/**
 * Mock DynamoDB document client put operation
 *
 * @param promise - Promise returned by DynamoDB
 *
 * @return Jasmine spy
 */
export function mockDynamoDBDocumentClientPut<T>(
  promise: () => Promise<T>
): jasmine.Spy {
  const put = jasmine.createSpy("put")
    .and.returnValue({ promise })
  Object.defineProperty(_.DynamoDB, "DocumentClient", {
    value: jasmine.createSpy("DocumentClient")
      .and.returnValue({ put })
  })
  return put
}

/**
 * Mock DynamoDB document client put operation returning with success
 *
 * @return Jasmine spy
 */
export function mockDynamoDBDocumentClientPutWithResult() {
  return mockDynamoDBDocumentClientPut(() => Promise.resolve({}))
}

/**
 * Mock DynamoDB document client put operation throwing an error
 *
 * @param err - Error to be thrown
 *
 * @return Jasmine spy
 */
export function mockDynamoDBDocumentClientPutWithError(
  err: Error = new Error("mockDynamoDBDocumentClientPutWithError")
): jasmine.Spy {
  return mockDynamoDBDocumentClientPut(() => Promise.reject(err))
}

/* ------------------------------------------------------------------------- */

/**
 * Mock DynamoDB document client delete operation
 *
 * @param promise - Promise returned by DynamoDB
 *
 * @return Jasmine spy
 */
export function mockDynamoDBDocumentClientDelete<T>(
  promise: () => Promise<T>
): jasmine.Spy {
  const del = jasmine.createSpy("delete")
    .and.returnValue({ promise })
  Object.defineProperty(_.DynamoDB, "DocumentClient", {
    value: jasmine.createSpy("DocumentClient")
      .and.returnValue({ delete: del })
  })
  return del
}

/**
 * Mock DynamoDB document client delete operation returning with result
 *
 * @param code - Verification code
 *
 * @return Jasmine spy
 */
export function mockDynamoDBDocumentClientDeleteWithResult(
  code: VerificationCode = mockVerificationCode("register")
) {
  return mockDynamoDBDocumentClientDelete(() => Promise.resolve({
    Attributes: code
  }))
}

/**
 * Mock DynamoDB document client delete operation returning with no result
 *
 * @return Jasmine spy
 */
export function mockDynamoDBDocumentClientDeleteWithoutResult() {
  return mockDynamoDBDocumentClientDelete(() => Promise.resolve({}))
}

/**
 * Mock DynamoDB document client delete operation throwing an error
 *
 * @param err - Error to be thrown
 *
 * @return Jasmine spy
 */
export function mockDynamoDBDocumentClientDeleteWithError(
  err: Error = new Error("mockDynamoDBDocumentClientDeleteWithError")
): jasmine.Spy {
  return mockDynamoDBDocumentClientDelete(() => Promise.reject(err))
}

/* ------------------------------------------------------------------------- */

/**
 * Mock SNS publish operation
 *
 * @param promise - Promise returned by SNS
 *
 * @return Jasmine spy
 */
export function mockSNSPublish<T>(
  promise: () => Promise<T>
): jasmine.Spy {
  const publish = jasmine.createSpy("publish")
    .and.returnValue({ promise })
  Object.defineProperty(_, "SNS", {
    value: jasmine.createSpy("SNS")
      .and.returnValue({ publish })
  })
  return publish
}

/**
 * Mock SNS publish operation returning with success
 *
 * @return Jasmine spy
 */
export function mockSNSPublishWithResult() {
  return mockSNSPublish(() => Promise.resolve({}))
}

/**
 * Mock SNS publish operation throwing an error
 *
 * @param err - Error to be thrown
 *
 * @return Jasmine spy
 */
export function mockSNSPublishWithError(
  err: Error = new Error("mockSNSPublishWithError")
): jasmine.Spy {
  return mockSNSPublish(() => Promise.reject(err))
}
