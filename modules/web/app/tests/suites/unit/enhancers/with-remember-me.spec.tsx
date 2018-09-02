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

import { shallow } from "enzyme"
import { prop } from "ramda"
import * as React from "react"

import {
  withRememberMe,
  WithRememberMe
} from "enhancers"

import { placeholder } from "_/helpers"
import { mockStore } from "_/mocks/providers"

/* ----------------------------------------------------------------------------
 * Tests
 * ------------------------------------------------------------------------- */

/* Remember me enhancer */
describe("enhancers/with-remember-me", () => {

  /* Initialize store */
  const store = mockStore({
    remember: { active: false }
  })

  /* Clear store */
  beforeEach(() => {
    store.clearActions()
  })

  /* withRememberMe */
  describe("withRememberMe", () => {

    /* Apply enhancer to placeholder component */
    const Placeholder = placeholder<WithRememberMe>()
    const Component = withRememberMe()(Placeholder)
    const wrapper = shallow<WithRememberMe>(<Component />, {
      context: { store }
    })

    /* { remember } */
    describe("{ remember }", () => {

      /* Remember me */
      const remember = wrapper.prop("remember")

      /* Test: should map state to props */
      it("should map state to props", () => {
        expect(prop("remember", store.getState())).toBe(remember)
      })
    })

    /* { setRememberMe } */
    describe("{ setRememberMe }", () => {

      /* Remember me toggle dispatcher */
      const setRememberMe = wrapper.prop("setRememberMe")

      /* Test: should map dispatch to props */
      it("should map dispatch to props", () => {
        expect(setRememberMe).toEqual(jasmine.any(Function))
      })

      /* Test: should dispatch action */
      it("should dispatch action", () => {
        setRememberMe(true)
        expect(store.getActions()).toMatchSnapshot()
        expect(store.getActions().length).toEqual(1)
      })
    })

    /* { setRememberMeResult } */
    describe("{ setRememberMeResult }", () => {

      /* Authentication result dispatcher */
      const setRememberMeResult = wrapper.prop("setRememberMeResult")

      /* Test: should map dispatch to props */
      it("should map dispatch to props", () => {
        expect(setRememberMeResult).toEqual(jasmine.any(Function))
      })

      /* Test: should dispatch action */
      it("should dispatch action", () => {
        setRememberMeResult(true)
        expect(store.getActions()).toMatchSnapshot()
        expect(store.getActions().length).toEqual(1)
      })
    })
  })
})
