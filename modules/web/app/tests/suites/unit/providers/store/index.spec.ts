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

import { pick } from "ramda"

import {
  dehydrate,
  rehydrate,
  State
} from "providers/store"

import { mockSession } from "_/mocks/common"

/* ----------------------------------------------------------------------------
 * Tests
 * ------------------------------------------------------------------------- */

/* Redux store */
describe("providers/store", () => {

  /* Clear local storage */
  beforeEach(() => {
    localStorage.clear()
  })

  /* dehydrate */
  describe("dehydrate", () => {

    /* Redux store state */
    const state: State = {
      notification: { show: false },
      remember: { active: false, failed: true },
      session: mockSession(true)
    }

    /* Test: should persist remember me state */
    it("should persist remember me state", () => {
      dehydrate(state)
      expect(JSON.parse(localStorage.getItem("state") || "{}"))
        .toEqual(jasmine.objectContaining({
          remember: pick(["active"], state.remember)
        }))
    })

    /* Test: should persist valid session state */
    it("should persist valid session state", () => {
      dehydrate(state)
      expect(JSON.parse(localStorage.getItem("state") || "{}"))
        .toEqual(jasmine.objectContaining({
          session: pick(["id", "access"], state.session)
        }))
    })

    /* Test: should persist empty session state */
    it("should persist empty session state", () => {
      dehydrate({ ...state, session: null })
      expect(JSON.parse(localStorage.getItem("state") || "{}"))
        .toEqual(jasmine.objectContaining({
          session: null
        }))
    })

    /* Test: should not persist notification state */
    it("should not persist notification state", () => {
      dehydrate(state)
      expect(JSON.parse(localStorage.getItem("state") || "{}"))
        .not.toEqual(jasmine.objectContaining({
          notification: { show: false }
        }))
    })
  })

  /* rehydrate */
  describe("rehydrate", () => {

    /* Redux store state */
    const state: Partial<State> = {
      remember: { active: false },
      session: null
    }

    /* Test: should retrieve state from local storage */
    it("should retrieve state from local storage", () => {
      localStorage.setItem("state", JSON.stringify(state))
      expect(rehydrate()).toEqual(state)
    })

    /* Test: should handle non-existing state */
    it("should handle non-existing state", () => {
      expect(rehydrate()).toEqual({})
    })
  })
})
