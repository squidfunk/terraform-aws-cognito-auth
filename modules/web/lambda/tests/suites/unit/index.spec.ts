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

import { handler } from "index"

import {
  mockCloudFrontResponseEvent
} from "_/mocks/vendor/aws-lambda"

/* ----------------------------------------------------------------------------
 * Tests
 * ------------------------------------------------------------------------- */

/* Lambda handler */
describe("handler", () => {

  /* CloudFront origin response event */
  const event = mockCloudFrontResponseEvent()

  /* Test: should set 'Content-Security-Policy' header */
  it("should set 'Content-Security-Policy' header", async () => {
    const { headers } = handler(event)
    expect(headers["Content-Security-Policy"]).toBeDefined()
    expect(headers["Content-Security-Policy"][0]).toEqual({
      key: "Content-Security-Policy",
      value: "default-src 'self'; style-src 'self' 'unsafe-inline'"
    })
  })

  /* Test: should set 'Strict-Transport-Security' header */
  it("should set 'Strict-Transport-Security' header", async () => {
    const { headers } = handler(event)
    expect(headers["Strict-Transport-Security"]).toBeDefined()
    expect(headers["Strict-Transport-Security"][0]).toEqual({
      key: "Strict-Transport-Security",
      value: "max-age=31536000; includeSubdomains; preload"
    })
  })

  /* Test: should set 'Referrer-Policy' header */
  it("should set 'Referrer-Policy' header", async () => {
    const { headers } = handler(event)
    expect(headers["Referrer-Policy"]).toBeDefined()
    expect(headers["Referrer-Policy"][0]).toEqual({
      key: "Referrer-Policy",
      value: "no-referrer"
    })
  })

  /* Test: should set 'X-Content-Type-Options' header */
  it("should set 'X-Content-Type-Options' header", async () => {
    const { headers } = handler(event)
    expect(headers["X-Content-Type-Options"]).toBeDefined()
    expect(headers["X-Content-Type-Options"][0]).toEqual({
      key: "X-Content-Type-Options",
      value: "nosniff"
    })
  })

  /* Test: should set 'X-Frame-Options' header */
  it("should set 'X-Frame-Options' header", async () => {
    const { headers } = handler(event)
    expect(headers["X-Frame-Options"]).toBeDefined()
    expect(headers["X-Frame-Options"][0]).toEqual({
      key: "X-Frame-Options",
      value: "DENY"
    })
  })

  /* Test: should set 'X-XSS-Protection' header */
  it("should set 'X-XSS-Protection' header", async () => {
    const { headers } = handler(event)
    expect(headers["X-XSS-Protection"]).toBeDefined()
    expect(headers["X-XSS-Protection"][0]).toEqual({
      key: "X-XSS-Protection",
      value: "1; mode=block"
    })
  })
})
