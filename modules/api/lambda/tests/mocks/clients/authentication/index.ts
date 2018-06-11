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

import { chance } from "_/helpers"

import {
  AuthenticationClient,
  Session
} from "~/clients/authentication"

/* ----------------------------------------------------------------------------
 * Data
 * ------------------------------------------------------------------------- */

/**
 * Mock session
 *
 * @return Session
 */
export function mockSession(): Session {
  return {
    access: {
      token: chance.string({ length: 128 }),
      expires: chance.date().toISOString()
    }
  }
}

/* ----------------------------------------------------------------------------
 * Functions
 * ------------------------------------------------------------------------- */

/**
 * Mock AuthenticationClient.authenticate
 *
 * @param promise - Promise returned by authentication client
 *
 * @return Jasmine spy
 */
function mockAuthenticationClientAuthenticate<T>(
  promise: () => Promise<T>
): jasmine.Spy {
  return spyOn(AuthenticationClient.prototype, "authenticate")
    .and.callFake(promise)
}

/**
 * Mock AuthenticationClient.authenticate returning with result
 *
 * @param session - Session
 *
 * @return Jasmine spy
 */
export function mockAuthenticationClientAuthenticateWithResult(
  session: Session = mockSession()
): jasmine.Spy {
  return mockAuthenticationClientAuthenticate(() => Promise.resolve(session))
}

/**
 * Mock AuthenticationClient.authenticate throwing an error
 *
 * @param err - Error to be thrown
 *
 * @return Jasmine spy
 */
export function mockAuthenticationClientAuthenticateWithError(
  err: Error = new Error("mockAuthenticationClientAuthenticateWithError")
): jasmine.Spy {
  return mockAuthenticationClientAuthenticate(() => Promise.reject(err))
}

/* ------------------------------------------------------------------------- */

/**
 * Mock AuthenticationClient.register
 *
 * @param promise - Promise returned by authentication client
 *
 * @return Jasmine spy
 */
function mockAuthenticationClientRegister<T>(
  promise: () => Promise<T>
): jasmine.Spy {
  return spyOn(AuthenticationClient.prototype, "register")
    .and.callFake(promise)
}

/**
 * Mock AuthenticationClient.register returning with success
 *
 * @return Jasmine spy
 */
export function mockAuthenticationClientRegisterWithSuccess(): jasmine.Spy {
  return mockAuthenticationClientRegister(() => Promise.resolve())
}

/**
 * Mock AuthenticationClient.register throwing an error
 *
 * @param err - Error to be thrown
 *
 * @return Jasmine spy
 */
export function mockAuthenticationClientRegisterWithError(
  err: Error = new Error("mockAuthenticationClientRegisterWithError")
): jasmine.Spy {
  return mockAuthenticationClientRegister(() => Promise.reject(err))
}

/* ------------------------------------------------------------------------- */

/**
 * Mock AuthenticationClient.forgotPassword
 *
 * @param promise - Promise returned by authentication client
 *
 * @return Jasmine spy
 */
function mockAuthenticationClientForgotPassword<T>(
  promise: () => Promise<T>
): jasmine.Spy {
  return spyOn(AuthenticationClient.prototype, "forgotPassword")
    .and.callFake(promise)
}

/**
 * Mock AuthenticationClient.forgotPassword returning with success
 *
 * @return Jasmine spy
 */
export function mockAuthenticationClientForgotPasswordWithSuccess() {
  return mockAuthenticationClientForgotPassword(() => Promise.resolve())
}

/**
 * Mock AuthenticationClient.forgotPassword throwing an error
 *
 * @param err - Error to be thrown
 *
 * @return Jasmine spy
 */
export function mockAuthenticationClientForgotPasswordWithError(
  err: Error = new Error("mockAuthenticationClientForgotPasswordWithError")
): jasmine.Spy {
  return mockAuthenticationClientForgotPassword(() => Promise.reject(err))
}
