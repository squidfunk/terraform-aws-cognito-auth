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

import * as _ from "mime"

/* ----------------------------------------------------------------------------
 * Functions
 * ------------------------------------------------------------------------- */

/**
 * Mock Mime.getType
 *
 * @param cb - Fake callback
 *
 * @return Jasmine spy
 */
function mockMimeGetType(
  cb: () => void
): jasmine.Spy {
  return spyOn(_, "getType")
    .and.callFake(cb)
}

/**
 * Mock Mime.getType returning with result
 *
 * @param type - Returned type
 *
 * @return Jasmine spy
 */
export function mockMimeGetTypeWithResult(
  type: string = "image/png"
): jasmine.Spy {
  return mockMimeGetType(() => type)
}

/**
 * Mock Mime.getType throwing an error
 *
 * @param err - Error to be thrown
 *
 * @return Jasmine spy
 */
export function mockMimeGetTypeWithError(
  err: Error = new Error("mockMimeGetTypeWithError")
): jasmine.Spy {
  return mockMimeGetType(() => { throw err })
}
