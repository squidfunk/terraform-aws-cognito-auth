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

import { shallow } from "enzyme"
import * as React from "react"
import { MockStoreEnhanced } from "redux-mock-store"

import { withRememberMe } from "enhancers"
import { State } from "providers/store"

import { Placeholder } from "_/mocks/components"
import {
  mockSetRememberMeAction,
  mockSetRememberMeResultAction,
  mockStore
} from "_/mocks/providers"

/* ----------------------------------------------------------------------------
 * Tests
 * ------------------------------------------------------------------------- */

/* Remember me enhancer */
describe("enhancers/with-remember-me", () => {

  /* Shallow-render placeholder wrapped with enhancer */
  function shallowPlaceholder(
    store: MockStoreEnhanced<Partial<State>>
  ) {
    const Component = withRememberMe()(Placeholder)
    return shallow(<Component />, {
      context: { store }
    })
  }

  /* withRememberMe */
  describe("withRememberMe", () => {

    /* Initialize store */
    const store = mockStore({
      remember: { active: false }
    })

    /* Clear store */
    beforeEach(() => {
      store.clearActions()
    })

    /* { remember } */
    describe("{ remember }", () => {

      /* Test: should map state to props */
      it("should map state to props", () => {
        const wrapper = shallowPlaceholder(store)
        const { remember } = store.getState()
        expect(wrapper.prop("remember")).toBe(remember)
      })
    })

    /* { setRememberMe } */
    describe("{ setRememberMe }", () => {

      /* Test: should map dispatch to props */
      it("should map dispatch to props", () => {
        const wrapper = shallowPlaceholder(store)
        expect(wrapper.prop("setRememberMe"))
          .toEqual(jasmine.any(Function))
      })

      /* Test: should dispatch action */
      it("should dispatch action", () => {
        const wrapper = shallowPlaceholder(store)
        const setRememberMe = wrapper.prop("setRememberMe")
        mockSetRememberMeAction()
        setRememberMe(true)
        expect(store.getActions().length).toEqual(1)
      })

      /* Test: should invoke action creator */
      it("should invoke action creator", () => {
        const wrapper = shallowPlaceholder(store)
        const setRememberMe = wrapper.prop("setRememberMe")
        const setRememberMeActionMock = mockSetRememberMeAction()
        setRememberMe(true)
        expect(setRememberMeActionMock)
          .toHaveBeenCalledWith(true)
      })
    })

    /* { setRememberMeResult } */
    describe("{ setRememberMeResult }", () => {

      /* Test: should map dispatch to props */
      it("should map dispatch to props", () => {
        const wrapper = shallowPlaceholder(store)
        expect(wrapper.prop("setRememberMeResult"))
          .toEqual(jasmine.any(Function))
      })

      /* Test: should dispatch action */
      it("should dispatch action", () => {
        const wrapper = shallowPlaceholder(store)
        const setRememberMeResult = wrapper.prop("setRememberMeResult")
        mockSetRememberMeResultAction()
        setRememberMeResult(true)
        expect(store.getActions().length).toEqual(1)
      })

      /* Test: should invoke action creator */
      it("should invoke action creator", () => {
        const wrapper = shallowPlaceholder(store)
        const setRememberMeResult = wrapper.prop("setRememberMeResult")
        const setRememberMeResultActionMock = mockSetRememberMeResultAction()
        setRememberMeResult(true)
        expect(setRememberMeResultActionMock)
          .toHaveBeenCalledWith(true)
      })
    })
  })
})
