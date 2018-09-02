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
  initSessionAction,
  session,
  terminateSessionAction,
} from "providers/store/session"

import { mockSession } from "_/mocks/common"
import { mockAction } from "_/mocks/providers"

/* ----------------------------------------------------------------------------
 * Tests
 * ------------------------------------------------------------------------- */

/* Session reducers */
describe("providers/store/session", () => {

  /* Session reducer */
  describe("session", () => {

    /* Test: should initialize state */
    it("should initialize state", () => {
      const action = mockAction()
      expect(session(undefined, action))
        .toEqual(null)
    })

    /* with SESSION_INIT */
    describe("with SESSION_INIT", () => {

      /* Session data */
      const { id, access } = mockSession()

      /* Test: should initialize session */
      it("should initialize session", () => {
        const action = initSessionAction({ id, access })
        expect(session(undefined, action))
          .toEqual(jasmine.objectContaining({ id, access }))
      })

      /* Test: should set renewed flag */
      it("should set renewed flag", () => {
        const action = initSessionAction({ id, access })
        expect(session(undefined, action))
          .toEqual(jasmine.objectContaining({ renewed: true }))
      })
    })

    /* with SESSION_TERMINATE */
    describe("with SESSION_TERMINATE", () => {

      /* Session data */
      const { id, access } = mockSession()

      /* Test: should reset session */
      it("should reset session", () => {
        const action = terminateSessionAction()
        expect(session({ id, access }, action))
          .toEqual(null)
      })
    })
  })
})
