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

import * as _ from "quoted-printable"

import { chance } from "_/helpers"

/* ----------------------------------------------------------------------------
 * Functions
 * ------------------------------------------------------------------------- */

/**
 * Mock `quoted-printable.encode`
 *
 * @param cb - Fake callback
 *
 * @return Jasmine spy
 */
function mockQuotedPrintableEncode(
  cb: () => string
): jasmine.Spy {
  return spyOn(_, "encode")
    .and.callFake(cb)
}

/**
 * Mock `quoted-printable.encode` returning with success
 *
 * @return Jasmine spy
 */
export function mockQuotedPrintableEncodeWithSuccess(): jasmine.Spy {
  return mockQuotedPrintableEncode(() => chance.string())
}

/**
 * Mock `quoted-printable.encode` throwing an error
 *
 * @param err - Error to be thrown
 *
 * @return Jasmine spy
 */
export function mockQuotedPrintableEncodeWithError(
  err: Error = new Error("encode")
): jasmine.Spy {
  return mockQuotedPrintableEncode(() => { throw err })
}
