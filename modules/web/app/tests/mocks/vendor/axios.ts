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

import axios from "axios"

/* ----------------------------------------------------------------------------
 * Functions
 * ------------------------------------------------------------------------- */

/**
 * Mock Axios.post
 *
 * @param promise - Promise returned by Axios
 *
 * @return Jasmine spy
 */
function mockAxiosPost<T>(
  promise: () => Promise<T>
): jasmine.Spy {
  return spyOn(axios, "post")
    .and.callFake(promise)
}

/**
 * Mock Axios.post returning with result
 *
 * @template T - Response type
 *
 * @return Jasmine spy
 */
export function mockAxiosPostWithResult<T = void>(
  response?: T
): jasmine.Spy {
  return mockAxiosPost(() => Promise.resolve({
    data: response
  }))
}

/**
 * Mock Axios.post throwing an error
 *
 * @param err - Error to be thrown
 * @param message - Error message
 *
 * @return Jasmine spy
 */
export function mockAxiosPostWithError(
  err: Error = new Error("post"),
  message?: string
): jasmine.Spy {
  if (message)
    (err as any).response = { data: { message } }
  return mockAxiosPost(() => Promise.reject(err))
}
