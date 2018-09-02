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

import { mount, shallow } from "enzyme"
import * as React from "react"
import { MemoryRouter } from "react-router"

import { setRememberMeResultAction } from "providers/store/remember-me"
import {
  SessionActionTypes,
  terminateSessionAction
} from "providers/store/session/actions"
import {
  Leave,
  Render
} from "routes/Leave/Leave"

import { search } from "_/helpers"
import { mockStore } from "_/mocks/providers"
import {
  mockAxiosPostWithError,
  mockAxiosPostWithResult
} from "_/mocks/vendor/axios"

/* ----------------------------------------------------------------------------
 * Tests
 * ------------------------------------------------------------------------- */

/* Sign out component */
describe("components/Leave", () => {

  /* Render component */
  describe("Render", () => {

    /* Test: should render with default props */
    it("should render with default props", () => {
      const wrapper = shallow(<Render />)
      expect(wrapper).toMatchSnapshot()
    })
  })

  /* Enhanced component */
  describe("Leave", () => {

    /* Initialize store */
    const store = mockStore({
      remember: {
        active: false
      }
    })

    /* Clear store */
    beforeEach(() => {
      store.clearActions()
    })

    /* Test: should render with default props */
    it("should render with default props", () => {
      mockAxiosPostWithResult()
      const wrapper = shallow(<Leave />, {
        context: { store }
      })
      expect(search(wrapper, Render)).toMatchSnapshot()
    })

    /* Test: should disable token-based authentication before mount */
    it("should disable token-based authentication before mount", () => {
      mockAxiosPostWithResult()
      mount(
        <MemoryRouter>
          <Leave />
        </MemoryRouter>, {
          context: { store },
          childContextTypes: {
            store: () => null
          }
        }
      )
      expect(store.getActions().length).toEqual(2)
      expect(store.getActions()[0])
        .toEqual(setRememberMeResultAction(false))
    })

    /* Test: should send request form after mount */
    it("should send request after mount", () => {
      const postMock = mockAxiosPostWithResult()
      mount(
        <MemoryRouter>
          <Leave />
        </MemoryRouter>, {
          context: { store },
          childContextTypes: {
            store: () => null
          }
        }
      )
      expect(postMock).toHaveBeenCalled()
    })

    /* Test: should terminate session for successful request */
    it("should terminate session for successful request", async () => {
      mockAxiosPostWithResult()
      mount(
        <MemoryRouter>
          <Leave />
        </MemoryRouter>, {
          context: { store },
          childContextTypes: {
            store: () => null
          }
        }
      )
      await new Promise(resolve => setTimeout(resolve, 500))
      expect(store.getActions().find(action => {
        return action.type === SessionActionTypes.TERMINATE
      }))
        .toEqual(terminateSessionAction())
    })

    /* Test: should terminate session for failed request */
    it("should terminate session for failed request", async () => {
      mockAxiosPostWithError()
      mount(
        <MemoryRouter>
          <Leave />
        </MemoryRouter>, {
          context: { store },
          childContextTypes: {
            store: () => null
          }
        }
      )
      await new Promise(resolve => setTimeout(resolve, 500))
      expect(store.getActions().find(action => {
        return action.type === SessionActionTypes.TERMINATE
      }))
        .toEqual(terminateSessionAction())
    })
  })
})
