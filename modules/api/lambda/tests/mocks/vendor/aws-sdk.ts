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

import { chance } from "_/helpers"
import { mockVerificationCode } from "_/mocks/verification"

/* ----------------------------------------------------------------------------
 * Functions
 * ------------------------------------------------------------------------- */

/**
 * Mock CognitoIdentityServiceProvider.adminGetUser
 *
 * @param promise - Promise returned by Cognito IDP
 *
 * @return Jasmine spy
 */
export function mockCognitoIDPAdminGetUser<T>(
  promise: () => Promise<T>
): jasmine.Spy {
  const adminGetUser = jasmine.createSpy("adminGetUser")
    .and.returnValue({ promise })
  Object.defineProperty(_, "CognitoIdentityServiceProvider", {
    value: jasmine.createSpy("CognitoIdentityServiceProvider")
      .and.returnValue({ adminGetUser })
  })
  return adminGetUser
}

/**
 * Mock CognitoIdentityServiceProvider.adminGetUser returning with result
 *
 * @param username - Username or email address
 *
 * @return Jasmine spy
 */
export function mockCognitoIDPAdminGetUserWithResult(
  username: string = chance.string()
) {
  return mockCognitoIDPAdminGetUser(() => Promise.resolve({
    Username: username
  }))
}

/**
 * Mock CognitoIdentityServiceProvider.adminGetUser throwing an error
 *
 * @param err - Error to be thrown
 *
 * @return Jasmine spy
 */
export function mockCognitoIDPAdminGetUserWithError(
  err: Error = new Error("mockCognitoIDPAdminGetUserWithError")
): jasmine.Spy {
  return mockCognitoIDPAdminGetUser(() => Promise.reject(err))
}

/* ------------------------------------------------------------------------- */

/**
 * Mock CognitoIdentityServiceProvider.signUp
 *
 * @param promise - Promise returned by Cognito IDP
 *
 * @return Jasmine spy
 */
export function mockCognitoIDPSignUp<T>(
  promise: () => Promise<T>
): jasmine.Spy {
  const signUp = jasmine.createSpy("signUp")
    .and.returnValue({ promise })
  Object.defineProperty(_, "CognitoIdentityServiceProvider", {
    value: jasmine.createSpy("CognitoIdentityServiceProvider")
      .and.returnValue({ signUp })
  })
  return signUp
}

/**
 * Mock CognitoIdentityServiceProvider.signUp returning with result
 *
 * @return Jasmine spy
 */
export function mockCognitoIDPSignUpWithSuccess() {
  return mockCognitoIDPSignUp(() => Promise.resolve())
}

/**
 * Mock CognitoIdentityServiceProvider.signUp throwing an error
 *
 * @param err - Error to be thrown
 *
 * @return Jasmine spy
 */
export function mockCognitoIDPSignUpWithError(
  err: Error = new Error("mockCognitoIDPSignUpWithError")
): jasmine.Spy {
  return mockCognitoIDPSignUp(() => Promise.reject(err))
}

/* ------------------------------------------------------------------------- */

/**
 * Mock CognitoIdentityServiceProvider.initiateAuth
 *
 * @param promise - Promise returned by Cognito IDP
 *
 * @return Jasmine spy
 */
export function mockCognitoIDPInitiateAuth<T>(
  promise: () => Promise<T>
): jasmine.Spy {
  const initiateAuth = jasmine.createSpy("initiateAuth")
    .and.returnValue({ promise })
  Object.defineProperty(_, "CognitoIdentityServiceProvider", {
    value: jasmine.createSpy("CognitoIdentityServiceProvider")
      .and.returnValue({ initiateAuth })
  })
  return initiateAuth
}

/**
 * Mock CognitoIdentityServiceProvider.initiateAuth returning with result
 *
 * @return Jasmine spy
 */
export function mockCognitoIDPInitiateAuthWithCredentials() {
  return mockCognitoIDPInitiateAuth(() => Promise.resolve({
    AuthenticationResult: {
      AccessToken: chance.string({ length: 128 }),
      IdToken: chance.string({ length: 128 }),
      RefreshToken: chance.string({ length: 128 })
    }
  }))
}

/**
 * Mock CognitoIdentityServiceProvider.initiateAuth returning with result
 *
 * @return Jasmine spy
 */
export function mockCognitoIDPInitiateAuthWithToken() {
  return mockCognitoIDPInitiateAuth(() => Promise.resolve({
    AuthenticationResult: {
      AccessToken: chance.string({ length: 128 }),
      IdToken: chance.string({ length: 128 })
    }
  }))
}

/**
 * Mock CognitoIdentityServiceProvider.initiateAuth returning with result
 *
 * @param challenge - Challenge name
 *
 * @return Jasmine spy
 */
export function mockCognitoIDPInitiateAuthWithChallenge(
  challenge: string = chance.string()
) {
  return mockCognitoIDPInitiateAuth(() => Promise.resolve({
    ChallengeName: challenge
  }))
}

/**
 * Mock CognitoIdentityServiceProvider.initiateAuth throwing an error
 *
 * @param err - Error to be thrown
 *
 * @return Jasmine spy
 */
export function mockCognitoIDPInitiateAuthWithError(
  err: Error = new Error("mockCognitoIDPInitiateAuthWithError")
): jasmine.Spy {
  return mockCognitoIDPInitiateAuth(() => Promise.reject(err))
}

/* ------------------------------------------------------------------------- */

/**
 * Mock DynamoDB.DocumentClient.put
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
 * Mock DynamoDB.DocumentClient.put returning with success
 *
 * @return Jasmine spy
 */
export function mockDynamoDBDocumentClientPutWithResult() {
  return mockDynamoDBDocumentClientPut(() => Promise.resolve({}))
}

/**
 * Mock DynamoDB.DocumentClient.put throwing an error
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
 * Mock DynamoDB.DocumentClient.delete operation
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
 * Mock DynamoDB.DocumentClient.delete returning with result
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
 * Mock DynamoDB.DocumentClient.delete returning with no result
 *
 * @return Jasmine spy
 */
export function mockDynamoDBDocumentClientDeleteWithoutResult() {
  return mockDynamoDBDocumentClientDelete(() => Promise.resolve({}))
}

/**
 * Mock DynamoDB.DocumentClient.delete throwing an error
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
 * Mock SNS.publish
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
 * Mock SNS.publish returning with success
 *
 * @return Jasmine spy
 */
export function mockSNSPublishWithResult() {
  return mockSNSPublish(() => Promise.resolve({}))
}

/**
 * Mock SNS.publish throwing an error
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
