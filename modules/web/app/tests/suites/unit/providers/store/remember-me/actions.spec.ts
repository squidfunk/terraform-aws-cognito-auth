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

import {
  setRememberMeAction,
  setRememberMeResultAction
} from "providers/store/remember-me"

import { mockStore } from "_/mocks/providers"

/* ----------------------------------------------------------------------------
 * Tests
 * ------------------------------------------------------------------------- */

/* Remember me actions */
describe("providers/store/remember-me", () => {

  /* Initialize store */
  const store = mockStore()

  /* Clear store */
  beforeEach(() => {
    store.clearActions()
  })

  /* setRememberMeAction */
  describe("setRememberMeAction", () => {

    /* Test: should activate remember me */
    it("should activate remember me", () => {
      store.dispatch(setRememberMeAction(true))
      expect(store.getActions()).toMatchSnapshot()
    })

    /* Test: should activate remember me */
    it("should deactivate remember me", () => {
      store.dispatch(setRememberMeAction(false))
      expect(store.getActions()).toMatchSnapshot()
    })
  })

  /* setRememberMeResultAction */
  describe("setRememberMeResultAction", () => {

    /* Test: should indicate a successful authentication attempt */
    it("should indicate a successful authentication attempt", () => {
      store.dispatch(setRememberMeResultAction(true))
      expect(store.getActions()).toMatchSnapshot()
    })

    /* Test: should indicate a failed authentication attempt */
    it("should indicate a failed authentication attempt", () => {
      store.dispatch(setRememberMeResultAction(false))
      expect(store.getActions()).toMatchSnapshot()
    })
  })
})
