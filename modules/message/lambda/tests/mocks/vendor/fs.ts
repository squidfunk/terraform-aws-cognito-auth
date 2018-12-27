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

import * as _ from "fs"

import { chance } from "_/helpers"

/* ----------------------------------------------------------------------------
 * Functions
 * ------------------------------------------------------------------------- */

/**
 * Mock `fs.readFile`
 *
 * @param cb - Fake callback
 *
 * @return Jasmine spy
 */
function mockFsReadFile(
  cb: (path: string, encoding: any, cb: (...args: any[]) => void) => void
): jasmine.Spy {
  return spyOn(_, "readFile")
    .and.callFake(cb)
}

/**
 * Mock `fs.readFile` returning with result
 *
 * @param data - File contents
 *
 * @return Jasmine spy
 */
export function mockFsReadFileWithResult(
  data: string = chance.string()
): jasmine.Spy {
  return mockFsReadFile((_path, encodingOrCb, cb) => {
    (cb || encodingOrCb)(undefined, data)
  })
}

/**
 * Mock `fs.readFile` throwing an error
 *
 * @param data - File contents
 *
 * @return Jasmine spy
 */
export function mockFsReadFileWithError(
  err: Error = new Error("readFile")
): jasmine.Spy {
  return mockFsReadFile((_path, encodingOrCb, cb) => {
    (cb || encodingOrCb)(err)
  })
}

/* ------------------------------------------------------------------------- */

/**
 * Mock `fs.readdir`
 *
 * @param cb - Fake callback
 *
 * @return Jasmine spy
 */
function mockFsReaddir(
  cb: (path: string, cb: (...args: any[]) => void) => void
): jasmine.Spy {
  return spyOn(_, "readdir")
    .and.callFake(cb)
}

/**
 * Mock `fs.readdir` returning with result
 *
 * @param files - File list
 *
 * @return Jasmine spy
 */
export function mockFsReaddirWithResult(
  files: string[] = [chance.string()]
): jasmine.Spy {
  return mockFsReaddir((_path, cb) => cb(undefined, files))
}

/**
 * Mock `fs.readdir` throwing an error
 *
 * @param data - File contents
 *
 * @return Jasmine spy
 */
export function mockFsReaddirWithError(
  err: Error = new Error("readdir")
): jasmine.Spy {
  return mockFsReaddir((_path, cb) => cb(err))
}
