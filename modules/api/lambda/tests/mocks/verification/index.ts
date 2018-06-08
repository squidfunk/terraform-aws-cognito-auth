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

import {
  Verification,
  VerificationCode,
  VerificationContext
} from "~/verification"

import { chance } from "_/helpers"

/* ----------------------------------------------------------------------------
 * Data
 * ------------------------------------------------------------------------- */

/**
 * Mock verification context
 *
 * @return Verification context
 */
export function mockVerificationContext(): VerificationContext {
  return [
    "register",
    "reset"
  ][Math.floor(Math.random() * 2)] as VerificationContext
}

/**
 * Mock verification code
 *
 * @param context - Verification context
 *
 * @return Verification code
 */
export function mockVerificationCode(
  context: VerificationContext = mockVerificationContext()
): VerificationCode {
  return {
    id: chance.string({ pool: "0123456789abcdef", length: 32 }),
    context,
    subject: chance.guid(),
    expires: Math.floor(chance.date().getTime() / 1000)
  }
}

/* ----------------------------------------------------------------------------
 * Functions
 * ------------------------------------------------------------------------- */

/**
 * Mock Verification.issue
 *
 * @param promise - Promise returned by verification
 *
 * @return Jasmine spy
 */
export function mockVerificationIssue<T>(
  promise: () => Promise<T>
): jasmine.Spy {
  return spyOn(Verification.prototype, "issue")
    .and.callFake(promise)
}

/**
 * Mock Verification.issue returning with resut
 *
 * @param code - Verification code
 *
 * @return Jasmine spy
 */
export function mockVerificationIssueWithResult(
  code: VerificationCode = mockVerificationCode()
) {
  return mockVerificationIssue(() => Promise.resolve(code))
}

/**
 * Mock Verification.issue throwing an error
 *
 * @param err - Error to be thrown
 *
 * @return Jasmine spy
 */
export function mockVerificationIssueWithError(
  err: Error = new Error("mockVerificationIssueWithError")
): jasmine.Spy {
  return mockVerificationIssue(() => Promise.reject(err))
}

/* ------------------------------------------------------------------------- */

/**
 * Mock Verification.claim
 *
 * @param promise - Promise returned by verification
 *
 * @return Jasmine spy
 */
export function mockVerificationClaim<T>(
  promise: () => Promise<T>
): jasmine.Spy {
  return spyOn(Verification.prototype, "claim")
    .and.callFake(promise)
}

/**
 * Mock Verification.claim returning with result
 *
 * @param code - Verification code
 *
 * @return Jasmine spy
 */
export function mockVerificationClaimWithResult(
  code: VerificationCode = mockVerificationCode()
) {
  return mockVerificationClaim(() => Promise.resolve(code))
}

/**
 * Mock Verification.claim throwing an error
 *
 * @param err - Error to be thrown
 *
 * @return Jasmine spy
 */
export function mockVerificationClaimWithError(
  err: Error = new Error("mockVerificationClaimWithError")
): jasmine.Spy {
  return mockVerificationClaim(() => Promise.reject(err))
}
