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

import { Callback } from "aws-lambda"
import { mock, restore } from "aws-sdk-mock"

import { chance } from "_/helpers"

/* ----------------------------------------------------------------------------
 * Functions
 * ------------------------------------------------------------------------- */

/**
 * Mock CognitoIdentityServiceProvider.adminConfirmSignUp
 *
 * @param spy - Spy/fake to mock Cognito
 *
 * @return Jasmine spy
 */
function mockCognitoAdminConfirmSignUp(spy: jasmine.Spy) {
  mock("CognitoIdentityServiceProvider", "adminConfirmSignUp",
    (data: any, cb: Callback) => {
      cb(undefined, spy(data))
    })
  return spy
}

/**
 * Mock CognitoIdentityServiceProvider.adminConfirmSignUp returning with success
 *
 * @return Jasmine spy
 */
export function mockCognitoAdminConfirmSignUpWithSuccess() {
  return mockCognitoAdminConfirmSignUp(
    jasmine.createSpy("adminConfirmSignUp"))
}

/**
 * Mock CognitoIdentityServiceProvider.adminConfirmSignUp throwing an error
 *
 * @param err - Error to be thrown
 *
 * @return Jasmine spy
 */
export function mockCognitoAdminConfirmSignUpWithError(
  err: Error = new Error("mockCognitoAdminConfirmSignUpWithError")
): jasmine.Spy {
  return mockCognitoAdminConfirmSignUp(
    jasmine.createSpy("adminConfirmSignUp")
      .and.callFake(() => { throw err }))
}

/**
 * Restore CognitoIdentityServiceProvider.adminConfirmSignUp
 */
export function restoreCognitoAdminConfirmSignUp() {
  restore("CognitoIdentityServiceProvider", "adminConfirmSignUp")
}

/* ------------------------------------------------------------------------- */

/**
 * Mock CognitoIdentityServiceProvider.adminDeleteUser
 *
 * @param spy - Spy/fake to mock Cognito
 *
 * @return Jasmine spy
 */
function mockCognitoAdminDeleteUser(spy: jasmine.Spy) {
  mock("CognitoIdentityServiceProvider", "adminDeleteUser",
    (data: any, cb: Callback) => {
      cb(undefined, spy(data))
    })
  return spy
}

/**
 * Mock CognitoIdentityServiceProvider.adminDeleteUser returning with success
 *
 * @return Jasmine spy
 */
export function mockCognitoAdminDeleteUserWithSuccess() {
  return mockCognitoAdminDeleteUser(
    jasmine.createSpy("adminDeleteUser"))
}

/**
 * Mock CognitoIdentityServiceProvider.adminDeleteUser throwing an error
 *
 * @param err - Error to be thrown
 *
 * @return Jasmine spy
 */
export function mockCognitoAdminDeleteUserWithError(
  err: Error = new Error("mockCognitoAdminDeleteUserWithError")
): jasmine.Spy {
  return mockCognitoAdminDeleteUser(
    jasmine.createSpy("adminDeleteUser")
      .and.callFake(() => { throw err }))
}

/**
 * Restore CognitoIdentityServiceProvider.adminDeleteUser
 */
export function restoreCognitoAdminDeleteUser() {
  restore("CognitoIdentityServiceProvider", "adminDeleteUser")
}

/* ------------------------------------------------------------------------- */

/**
 * Mock CognitoIdentityServiceProvider.adminGetUser
 *
 * @param spy - Spy/fake to mock Cognito
 *
 * @return Jasmine spy
 */
function mockCognitoAdminGetUser(spy: jasmine.Spy) {
  mock("CognitoIdentityServiceProvider", "adminGetUser",
    (data: any, cb: Callback) => {
      cb(undefined, spy(data))
    })
  return spy
}

/**
 * Mock CognitoIdentityServiceProvider.adminGetUser returning with success
 *
 * @param username - Username
 *
 * @return Jasmine spy
 */
export function mockCognitoAdminGetUserWithResult(
  username: string = chance.guid()
) {
  return mockCognitoAdminGetUser(
    jasmine.createSpy("adminGetUser")
    .and.returnValue({
      Username: username,
      UserAttributes: [
        {
          Name: "sub",
          Value: chance.guid()
        },
        {
          Name: "email_verified",
          Value: chance.bool()
        },
        {
          Name: "email",
          Value: chance.email()
        }
      ],
      UserCreateDate: chance.date().getTime(),
      UserLastModifiedDate: chance.date().getTime(),
      Enabled: chance.bool(),
      UserStatus: "CONFIRMED"
    }))
}

/**
 * Mock CognitoIdentityServiceProvider.adminGetUser throwing an error
 *
 * @param err - Error to be thrown
 *
 * @return Jasmine spy
 */
export function mockCognitoAdminGetUserWithError(
  err: Error = new Error("mockCognitoAdminGetUserWithError")
): jasmine.Spy {
  return mockCognitoAdminGetUser(
    jasmine.createSpy("adminGetUser")
      .and.callFake(() => { throw err }))
}

/**
 * Restore CognitoIdentityServiceProvider.adminGetUser
 */
export function restoreCognitoAdminGetUser() {
  restore("CognitoIdentityServiceProvider", "adminGetUser")
}

/* ------------------------------------------------------------------------- */

/**
 * Mock CognitoIdentityServiceProvider.adminUpdateUserAttributes
 *
 * @param spy - Spy/fake to mock Cognito
 *
 * @return Jasmine spy
 */
function mockCognitoAdminUpdateUserAttributes(spy: jasmine.Spy) {
  mock("CognitoIdentityServiceProvider", "adminUpdateUserAttributes",
    (data: any, cb: Callback) => {
      cb(undefined, spy(data))
    })
  return spy
}

/**
 * Mock CognitoIdentityServiceProvider.adminUpdateUserAttributes with success
 *
 * @param username - Username
 *
 * @return Jasmine spy
 */
export function mockCognitoAdminUpdateUserAttributesWithSuccess(
  username: string = chance.guid()
) {
  return mockCognitoAdminUpdateUserAttributes(
    jasmine.createSpy("adminUpdateUserAttributes")
    .and.returnValue({
      Username: username
    }))
}

/**
 * Mock CognitoIdentityServiceProvider.adminUpdateUserAttributes with error
 *
 * @param err - Error to be thrown
 *
 * @return Jasmine spy
 */
export function mockCognitoAdminUpdateUserAttributesWithError(
  err: Error = new Error("mockCognitoAdminUpdateUserAttributesWithError")
): jasmine.Spy {
  return mockCognitoAdminUpdateUserAttributes(
    jasmine.createSpy("adminUpdateUserAttributes")
      .and.callFake(() => { throw err }))
}

/**
 * Restore CognitoIdentityServiceProvider.adminUpdateUserAttributes
 */
export function restoreCognitoAdminUpdateUserAttributes() {
  restore("CognitoIdentityServiceProvider", "adminUpdateUserAttributes")
}

/* ------------------------------------------------------------------------- */

/**
 * Mock CognitoIdentityServiceProvider.initiateAuth
 *
 * @param spy - Spy/fake to mock Cognito
 *
 * @return Jasmine spy
 */
function mockCognitoInitiateAuth(spy: jasmine.Spy) {
  mock("CognitoIdentityServiceProvider", "initiateAuth",
    (data: any, cb: Callback) => {
      cb(undefined, spy(data))
    })
  return spy
}

/**
 * Mock CognitoIdentityServiceProvider.initiateAuth with credentials
 *
 * @return Jasmine spy
 */
export function mockCognitoInitiateAuthWithCredentials() {
  return mockCognitoInitiateAuth(
    jasmine.createSpy("initiateAuth")
      .and.returnValue({
        AuthenticationResult: {
          AccessToken: chance.string({ length: 128 }),
          IdToken: chance.string({ length: 128 }),
          RefreshToken: chance.string({ length: 128 })
        }
      }))
}

/**
 * Mock CognitoIdentityServiceProvider.initiateAuth with token
 *
 * @return Jasmine spy
 */
export function mockCognitoInitiateAuthWithToken() {
  return mockCognitoInitiateAuth(
    jasmine.createSpy("initiateAuth")
      .and.returnValue({
        AuthenticationResult: {
          AccessToken: chance.string({ length: 128 }),
          IdToken: chance.string({ length: 128 })
        }
      }))
}

/**
 * Mock CognitoIdentityServiceProvider.initiateAuth returning with challenge
 *
 * @param challenge - Challenge name
 *
 * @return Jasmine spy
 */
export function mockCognitoInitiateAuthWithChallenge(
  challenge: string = chance.string()
) {
  return mockCognitoInitiateAuth(
    jasmine.createSpy("initiateAuth")
      .and.returnValue({
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
export function mockCognitoInitiateAuthWithError(
  err: Error = new Error("mockCognitoInitiateAuthWithError")
): jasmine.Spy {
  return mockCognitoInitiateAuth(
    jasmine.createSpy("initiateAuth")
      .and.callFake(() => { throw err }))
}

/**
 * Restore CognitoIdentityServiceProvider.initiateAuth
 */
export function restoreCognitoInitiateAuth() {
  restore("CognitoIdentityServiceProvider", "initiateAuth")
}

/* ------------------------------------------------------------------------- */

/**
 * Mock CognitoIdentityServiceProvider.signUp
 *
 * @param spy - Spy/fake to mock Cognito
 *
 * @return Jasmine spy
 */
function mockCognitoSignUp(spy: jasmine.Spy) {
  mock("CognitoIdentityServiceProvider", "signUp",
    (data: any, cb: Callback) => {
      cb(undefined, spy(data))
    })
  return spy
}

/**
 * Mock CognitoIdentityServiceProvider.signUp returning with success
 *
 * @return Jasmine spy
 */
export function mockCognitoSignUpWithSuccess() {
  return mockCognitoSignUp(
    jasmine.createSpy("signUp"))
}

/**
 * Mock CognitoIdentityServiceProvider.signUp throwing an error
 *
 * @param err - Error to be thrown
 *
 * @return Jasmine spy
 */
export function mockCognitoSignUpWithError(
  err: Error = new Error("mockCognitoSignUpWithError")
): jasmine.Spy {
  return mockCognitoSignUp(
    jasmine.createSpy("signUp")
      .and.callFake(() => { throw err }))
}

/**
 * Restore CognitoIdentityServiceProvider.signUp
 */
export function restoreCognitoSignUp() {
  restore("CognitoIdentityServiceProvider", "signUp")
}
