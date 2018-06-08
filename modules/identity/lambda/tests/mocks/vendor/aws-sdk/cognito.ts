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
 * Mock CognitoIdentityServiceProvider.listUsers
 *
 * @param spy - Spy/fake to mock Cognito
 *
 * @return Jasmine spy
 */
function mockCognitoListUsers(spy: jasmine.Spy) {
  mock("CognitoIdentityServiceProvider", "listUsers",
    (data: any, cb: Callback) => {
      cb(undefined, spy(data))
    })
  return spy
}

/**
 * Mock CognitoIdentityServiceProvider.listUsers returning with result
 *
 * @return Jasmine spy
 */
export function mockCognitoListUsersWithResult() {
  return mockCognitoListUsers(
    jasmine.createSpy("listUsers")
      .and.returnValue({
        Users: [
          {
            Username: chance.guid(),
            Attributes: [
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
          }
        ]
      }))
}

/**
 * Mock CognitoIdentityServiceProvider.listUsers returning with no result
 *
 * @return Jasmine spy
 */
export function mockCognitoListUsersWithoutResult() {
  return mockCognitoListUsers(
    jasmine.createSpy("listUsers")
      .and.returnValue({
        Users: []
      }))
}

/**
 * Mock CognitoIdentityServiceProvider.listUsers throwing an error
 *
 * @param err - Error to be thrown
 *
 * @return Jasmine spy
 */
export function mockCognitoListUsersWithError(
  err: Error = new Error("mockCognitoListUsersWithError")
): jasmine.Spy {
  return mockCognitoListUsers(
    jasmine.createSpy("listUsers")
      .and.callFake(() => { throw err }))
}

/**
 * Restore CognitoIdentityServiceProvider.listUsers
 */
export function restoreCognitoListUsers() {
  restore("CognitoIdentityServiceProvider", "listUsers")
}
