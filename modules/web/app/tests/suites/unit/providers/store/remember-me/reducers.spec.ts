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

import {
  remember,
  setRememberMeAction,
  setRememberMeResultAction
} from "providers/store/remember-me"

import { mockAction } from "_/mocks/providers"

/* ----------------------------------------------------------------------------
 * Tests
 * ------------------------------------------------------------------------- */

/* Remember me reducers */
describe("providers/store/remember-me", () => {

  /* Remember me reducer */
  describe("remember", () => {

    /* Test: should initialize state */
    it("should initialize state", () => {
      const action = mockAction()
      expect(remember(undefined, action))
        .toEqual({ active: false })
    })

    /* with REMEMBER_ME_SET */
    describe("with REMEMBER_ME_SET", () => {

      /* Test: should activate remember me */
      it("should activate remember me", () => {
        const action = setRememberMeAction(true)
        expect(remember(undefined, action))
          .toEqual(jasmine.objectContaining({ active: true }))
      })

      /* Test: should deactivate remember me */
      it("should deactivate remember me", () => {
        const action = setRememberMeAction(false)
        expect(remember(undefined, action))
          .toEqual(jasmine.objectContaining({ active: false }))
      })

      /* Test: should preserve re-authentication result */
      it("should preserve re-authentication result", () => {
        const action = setRememberMeAction(true)
        expect(remember({ active: false, result: false }, action))
          .toEqual({ active: true, result: false })
      })
    })

    /* with REMEMBER_ME_SET_RESULT */
    describe("with REMEMBER_ME_SET_RESULT", () => {

      /* Test: should indicate a successful re-authentication attempt */
      it("should indicate a successful re-authentication attempt", () => {
        const action = setRememberMeResultAction(true)
        expect(remember(undefined, action))
          .toEqual(jasmine.objectContaining({ result: true }))
      })

      /* Test: should indicate a failed re-authentication attempt */
      it("should indicate a failed re-authentication attempt", () => {
        const action = setRememberMeResultAction(false)
        expect(remember(undefined, action))
          .toEqual(jasmine.objectContaining({ result: false }))
      })

      /* Test: should preserve active flag */
      it("should preserve active flag", () => {
        const action = setRememberMeResultAction(true)
        expect(remember(undefined, action))
          .toEqual({ active: false, result: true })
      })
    })
  })
})
