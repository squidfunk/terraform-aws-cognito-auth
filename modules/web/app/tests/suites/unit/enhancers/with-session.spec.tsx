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
  withSession,
  WithSession
} from "enhancers"

import { Placeholder } from "_/helpers"
import { mockSession } from "_/mocks/common"
import { mockStore } from "_/mocks/providers"

/* ----------------------------------------------------------------------------
 * Tests
 * ------------------------------------------------------------------------- */

/* Session enhancer */
describe("enhancers/with-session", () => {

  /* Initialize store */
  const store = mockStore({
    session: mockSession()
  })

  /* Clear store */
  beforeEach(() => {
    store.clearActions()
  })

  /* withSession */
  describe("withSession", () => {

    /* Apply enhancer to placeholder component */
    const Component = withSession()(Placeholder)
    const component = shallow<WithSession>(<Component />, {
      context: { store }
    })

    /* { session } */
    describe("{ session }", () => {

      /* Session */
      const session = component.prop("session")

      /* Test: should map state to props */
      it("should map state to props", () => {
        expect(prop("session", store.getState())).toBe(session)
      })
    })

    /* { initSession } */
    describe("{ initSession }", () => {

      /* Initialize session dispatcher */
      const initSession = component.prop("initSession")

      /* Test: should map dispatch to props */
      it("should map dispatch to props", () => {
        expect(initSession).toEqual(jasmine.any(Function))
      })

      /* Test: should dispatch action */
      it("should dispatch action", () => {
        initSession(mockSession())
        expect(store.getActions()).toMatchSnapshot()
        expect(store.getActions().length).toEqual(1)
      })
    })

    /* { terminateSession } */
    describe("{ terminateSession }", () => {

      /* Terminate session dispatcher */
      const terminateSession = component.prop("terminateSession")

      /* Test: should map dispatch to props */
      it("should map dispatch to props", () => {
        expect(terminateSession).toEqual(jasmine.any(Function))
      })

      /* Test: should dispatch action */
      it("should dispatch action", () => {
        terminateSession()
        expect(store.getActions()).toMatchSnapshot()
        expect(store.getActions().length).toEqual(1)
      })
    })
  })
})
