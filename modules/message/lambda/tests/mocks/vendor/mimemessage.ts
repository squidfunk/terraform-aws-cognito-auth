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

import * as _ from "mimemessage"

/* ----------------------------------------------------------------------------
 * Data
 * ------------------------------------------------------------------------- */

/**
 * Mock `Entity`
 *
 * @return Mime message entity
 */
export function mockMimeMessageEntity(): jasmine.SpyObj<_.Entity> {
  return jasmine.createSpyObj("Entity", [
    "header",
    "toString"
  ])
}

/* ----------------------------------------------------------------------------
 * Functions
 * ------------------------------------------------------------------------- */

/**
 * Mock `mimemessage.factory`
 *
 * @param entity - Mime entity
 *
 * @return Jasmine spy
 */
export function mockMimeMessageFactoryWithResult(
  entity: jasmine.SpyObj<_.Entity> = mockMimeMessageEntity()
): jasmine.Spy {
  return spyOn(_, "factory")
    .and.returnValue(entity)
}

/**
 * Mock `mimemessage.factory` throwing an error
 *
 * @param err - Error to be thrown
 *
 * @return Jasmine spy
 */
export function mockMimeMessageFactoryWithError(
  err: Error = new Error("factory")
): jasmine.Spy {
  return spyOn(_, "factory")
    .and.callFake(() => { throw err })
}
