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

import * as _ from "mustache"

import { chance } from "_/helpers"

/* ----------------------------------------------------------------------------
 * Functions
 * ------------------------------------------------------------------------- */

/**
 * Mock Mustache.render
 *
 * @param cb - Fake callback
 *
 * @return Jasmine spy
 */
function mockMustacheRender(
  cb: () => void
): jasmine.Spy {
  return spyOn(_, "render")
    .and.callFake(cb)
}

/**
 * Mock Mustache.render returning with result
 *
 * @param result - Rendered string
 *
 * @return Jasmine spy
 */
export function mockMustacheRenderWithResult(
  result: string = chance.string()
): jasmine.Spy {
  return mockMustacheRender(() => result)
}

/**
 * Mock Mustache.render throwing an error
 *
 * @param err - Error to be thrown
 *
 * @return Jasmine spy
 */
export function mockMustacheRenderWithError(
  err: Error = new Error("render")
): jasmine.Spy {
  return mockMustacheRender(() => { throw err })
}
