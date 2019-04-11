/*
 * Copyright (c) 2018-2019 Martin Donath <martin.donath@squidfunk.com>
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
import { Session } from "common"
import { VerificationCode } from "verification"

import { mockSession } from "_/mocks/common"
import { mockVerificationCode } from "_/mocks/verification"

/* ----------------------------------------------------------------------------
 * Functions
 * ------------------------------------------------------------------------- */

/**
 * Mock `AuthenticationClient.authenticateWithCredentials`
 *
 * @param promise - Promise returned by authentication client
 *
 * @return Jasmine spy
 */
function mockAuthenticationClientAuthenticateWithCredentials(
  promise: () => Promise<Session<Date>>
): jasmine.Spy {
  return spyOn(AuthenticationClient.prototype, "authenticateWithCredentials")
    .and.callFake(promise)
}

/**
 * Mock `AuthenticationClient.authenticateWithCredentials` returning with result
 *
 * @param session - Session
 *
 * @return Jasmine spy
 */
export function mockAuthenticationClientAuthenticateWithCredentialsWithResult(
  session: Session = mockSession()
): jasmine.Spy {
  return mockAuthenticationClientAuthenticateWithCredentials(
    () => Promise.resolve(session)
  )
}

/**
 * Mock `AuthenticationClient.authenticateWithCredentials` throwing an error
 *
 * @param err - Error to be thrown
 *
 * @return Jasmine spy
 */
export function mockAuthenticationClientAuthenticateWithCredentialsWithError(
  err: Error = new Error("authenticateWithCredentials")
): jasmine.Spy {
  return mockAuthenticationClientAuthenticateWithCredentials(
    () => Promise.reject(err)
  )
}

/* ------------------------------------------------------------------------- */

/**
 * Mock `AuthenticationClient.authenticateWithToken`
 *
 * @param promise - Promise returned by authentication client
 *
 * @return Jasmine spy
 */
function mockAuthenticationClientAuthenticateWithToken(
  promise: () => Promise<Session<Date>>
): jasmine.Spy {
  return spyOn(AuthenticationClient.prototype, "authenticateWithToken")
    .and.callFake(promise)
}

/**
 * Mock `AuthenticationClient.authenticateWithToken` returning with result
 *
 * @param session - Session
 *
 * @return Jasmine spy
 */
export function mockAuthenticationClientAuthenticateWithTokenWithResult(
  session: Session = mockSession()
): jasmine.Spy {
  return mockAuthenticationClientAuthenticateWithToken(
    () => Promise.resolve(session)
  )
}

/**
 * Mock `AuthenticationClient.authenticateWithToken` throwing an error
 *
 * @param err - Error to be thrown
 *
 * @return Jasmine spy
 */
export function mockAuthenticationClientAuthenticateWithTokenWithError(
  err: Error = new Error("authenticateWithToken")
): jasmine.Spy {
  return mockAuthenticationClientAuthenticateWithToken(
    () => Promise.reject(err)
  )
}

/* ------------------------------------------------------------------------- */

/**
 * Mock `AuthenticationClient.register`
 *
 * @param promise - Promise returned by authentication client
 *
 * @return Jasmine spy
 */
function mockAuthenticationClientRegister(
  promise: () => Promise<VerificationCode>
): jasmine.Spy {
  return spyOn(AuthenticationClient.prototype, "register")
    .and.callFake(promise)
}

/**
 * Mock `AuthenticationClient.register` returning with success
 *
 * @return Jasmine spy
 */
export function mockAuthenticationClientRegisterWithSuccess(): jasmine.Spy {
  return mockAuthenticationClientRegister(() =>
    Promise.resolve(mockVerificationCode())
  )
}

/**
 * Mock `AuthenticationClient.register` throwing an error
 *
 * @param err - Error to be thrown
 *
 * @return Jasmine spy
 */
export function mockAuthenticationClientRegisterWithError(
  err: Error = new Error("register")
): jasmine.Spy {
  return mockAuthenticationClientRegister(() => Promise.reject(err))
}

/* ------------------------------------------------------------------------- */

/**
 * Mock `AuthenticationClient.forgotPassword`
 *
 * @param promise - Promise returned by authentication client
 *
 * @return Jasmine spy
 */
function mockAuthenticationClientForgotPassword(
  promise: () => Promise<VerificationCode>
): jasmine.Spy {
  return spyOn(AuthenticationClient.prototype, "forgotPassword")
    .and.callFake(promise)
}

/**
 * Mock `AuthenticationClient.forgotPassword` returning with success
 *
 * @return Jasmine spy
 */
export function mockAuthenticationClientForgotPasswordWithSuccess() {
  return mockAuthenticationClientForgotPassword(() =>
    Promise.resolve(mockVerificationCode())
  )
}

/**
 * Mock `AuthenticationClient.forgotPassword` throwing an error
 *
 * @param err - Error to be thrown
 *
 * @return Jasmine spy
 */
export function mockAuthenticationClientForgotPasswordWithError(
  err: Error = new Error("forgotPassword")
): jasmine.Spy {
  return mockAuthenticationClientForgotPassword(() => Promise.reject(err))
}
