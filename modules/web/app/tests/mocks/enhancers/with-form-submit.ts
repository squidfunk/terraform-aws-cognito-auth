
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

import { WithFormSubmit } from "enhancers"

import { mockAxiosError } from "_/mocks/vendor/axios"

/* ----------------------------------------------------------------------------
 * Data
 * ------------------------------------------------------------------------- */

/**
 * Mock form submission properties returning with success
 *
 * @param refresh - Whether to return a refresh token
 *
 * @return Session
 */
export function mockFormSubmitPropsWithSuccess<TResponse extends void>(
  response?: TResponse
): WithFormSubmit<{}, TResponse> {
  return {
    form: {
      pending: false,
      success: true,
      response
    },
    setForm: jest.fn(),
    submit: jest.fn()
  }
}

/**
 * Mock form submission properties throwing an error
 *
 * @param refresh - Whether to return a refresh token
 *
 * @return Session
 */
export function mockFormSubmitPropsWithError<TResponse extends void>(
  err: Error = new Error("submit")
): WithFormSubmit<{}, TResponse> {
  return {
    form: {
      pending: false,
      success: false,
      err: mockAxiosError(err)
    },
    setForm: jest.fn(),
    submit: jest.fn()
  }
}
