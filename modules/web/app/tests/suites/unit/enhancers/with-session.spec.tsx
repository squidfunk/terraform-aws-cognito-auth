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

import { withSession } from "enhancers"
import { State } from "providers/store"

import { mockSession } from "_/mocks/common"
import { Placeholder } from "_/mocks/components"
import {
  mockInitSessionAction,
  mockStore,
  mockTerminateSessionAction
} from "_/mocks/providers"

/* ----------------------------------------------------------------------------
 * Tests
 * ------------------------------------------------------------------------- */

/* Session enhancer */
describe("enhancers/with-session", () => {

  /* Shallow-render placeholder wrapped with enhancer */
  function shallowPlaceholder(
    store: MockStoreEnhanced<Partial<State>>
  ) {
    const Component = withSession()(Placeholder)
    return shallow(<Component />, {
      context: { store }
    })
  }

  /* withSession */
  describe("withSession", () => {

    /* Initialize store */
    const store = mockStore({
      session: mockSession()
    })

    /* Clear store */
    beforeEach(() => {
      store.clearActions()
    })

    /* { session } */
    describe("{ session }", () => {

      /* Test: should map state to props */
      it("should map state to props", () => {
        const wrapper = shallowPlaceholder(store)
        const { session } = store.getState()
        expect(wrapper.prop("session")).toBe(session)
      })
    })

    /* { initSession } */
    describe("{ initSession }", () => {

      /* Test: should map dispatch to props */
      it("should map dispatch to props", () => {
        const wrapper = shallowPlaceholder(store)
        expect(wrapper.prop("initSession"))
          .toEqual(jasmine.any(Function))
      })

      /* Test: should dispatch action */
      it("should dispatch action", () => {
        const wrapper = shallowPlaceholder(store)
        const initSession = wrapper.prop("initSession")
        mockInitSessionAction()
        initSession(mockSession())
        expect(store.getActions().length).toEqual(1)
      })

      /* Test: should invoke action creator */
      it("should invoke action creator", () => {
        const wrapper = shallowPlaceholder(store)
        const initSession = wrapper.prop("initSession")
        const initSessionActionMock = mockInitSessionAction()
        const session = mockSession()
        initSession(session)
        expect(initSessionActionMock)
          .toHaveBeenCalledWith(session)
      })
    })

    /* { terminateSession } */
    describe("{ terminateSession }", () => {

      /* Test: should map dispatch to props */
      it("should map dispatch to props", () => {
        const wrapper = shallowPlaceholder(store)
        expect(wrapper.prop("terminateSession"))
          .toEqual(jasmine.any(Function))
      })

      /* Test: should dispatch action */
      it("should dispatch action", () => {
        const wrapper = shallowPlaceholder(store)
        const terminateSession = wrapper.prop("terminateSession")
        mockTerminateSessionAction()
        terminateSession()
        expect(store.getActions().length).toEqual(1)
      })

      /* Test: should invoke action creator */
      it("should invoke action creator", () => {
        const wrapper = shallowPlaceholder(store)
        const terminateSession = wrapper.prop("terminateSession")
        const terminateSessionActionMock = mockTerminateSessionAction()
        terminateSession()
        expect(terminateSessionActionMock)
          .toHaveBeenCalledWith()
      })
    })
  })
})
