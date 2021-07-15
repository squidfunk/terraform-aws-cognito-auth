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

import { Options, generate } from "generate-password"

import { chance } from "_/helpers"

/* ----------------------------------------------------------------------------
 * Data
 * ------------------------------------------------------------------------- */

/**
 * Mock registration request
 *
 * We hardcode the domain example.com (see RFC 2606) because we don't want SES
 * to send out emails for our acceptance tests, so we know what to check for.
 *
 * @param options - Password generator options
 *
 * @return Registration request
 */
export function mockRegisterRequest(options?: Partial<Options>) {
  return {
    email: chance.email({ domain: "example.com" }),
    password: generate({
      length: 32,
      numbers: true,
      symbols: true,
      uppercase: true,
      excludeSimilarCharacters: true,
      strict: true,
      ...options
    })
  }
}

/**
 * Mock registration request with invalid email address
 *
 * @param options - Password generator options
 *
 * @return Registration request
 */
export function mockRegisterRequestWithInvalidEmail(
  options?: Partial<Options>
) {
  return {
    ...mockRegisterRequest(options),
    email: chance.string()
  }
}
