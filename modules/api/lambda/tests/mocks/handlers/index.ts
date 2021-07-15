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

import { HandlerCallbackResponse } from "handlers/_"

/* ----------------------------------------------------------------------------
 * Functions
 * ------------------------------------------------------------------------- */

/**
 * Mock handler callback
 *
 * @template TResponse - Callback response body type
 *
 * @param promise - Promise returned by handler callback
 *
 * @return Jasmine spy
 */
function mockHandlerCallback<TResponse extends {}>(
  promise: () => Promise<HandlerCallbackResponse<TResponse>>
): jasmine.Spy {
  return jasmine.createSpy("callback")
    .and.callFake(promise)
}

/**
 * Mock handler callback returning with success
 *
 * @param body - Response body
 * @param headers - Response headers
 *
 * @return Jasmine spy
 */
export function mockHandlerCallbackWithSuccess(
  body?: any, headers?: { [name: string]: string }
): jasmine.Spy {
  return mockHandlerCallback(() => Promise.resolve({ body, headers }))
}

/**
 * Mock handler callback throwing an error
 *
 * @param err - Error to be thrown
 *
 * @return Jasmine spy
 */
export function mockHandlerCallbackWithError(
  err: Error = new Error("callback")
): jasmine.Spy {
  return mockHandlerCallback(() => Promise.reject(err))
}
