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
import { RedirectProps } from "react-router-dom"
import { compose } from "recompose"

import { withFormSubmit } from "enhancers"
import {
  enhance,
  Render
} from "routes/Leave/LeaveSuccess"

import { find } from "_/helpers"
import { Placeholder } from "_/mocks/components"
import {
  mockWithFormSubmit,
  mockWithFormSubmitWithError,
  mockWithFormSubmitWithResult,
  mockWithNotification
} from "_/mocks/enhancers"

/* ----------------------------------------------------------------------------
 * Tests
 * ------------------------------------------------------------------------- */

/* Sign out success components */
describe("routes/LeaveSuccess", () => {

  /* Render component */
  describe("<Render />", () => {

    /* Test: should render redirect */
    it("should render redirect", () => {
      const wrapper = shallow(<Render />)
      const loading = find<RedirectProps>(wrapper, "Redirect")
      expect(loading.exists()).toBe(true)
    })

    /* Test: should redirect to '/' */
    it("should redirect to '/'", () => {
      const wrapper = shallow(<Render />)
      const loading = find<RedirectProps>(wrapper, "Redirect")
      expect(loading.prop("to")).toEqual("/")
    })
  })

  /* Sign out success component */
  describe("<LeaveSuccess />", () => {

    /* Mount placeholder wrapped with enhancer */
    function mountPlaceholder() {
      const Component = compose(
        withFormSubmit(),
        enhance()
      )(Placeholder)
      return mount(
        <MemoryRouter>
          <Component />
        </MemoryRouter>
      )
    }

    /* Mock enhancers */
    beforeEach(() => {
      mockWithNotification()
    })

    /* Test: should render with display name */
    it("should render with display name", () => {
      mockWithFormSubmit()
      const wrapper = mountPlaceholder()
      expect(wrapper.find(Placeholder).name()).toEqual("LeaveSuccess")
    })

    /* with successful request */
    describe("with successful request", () => {

      /* Mock enhancers */
      beforeEach(() => {
        mockWithFormSubmitWithResult()
      })

      /* Test: should dismiss notification */
      it("should not dismiss notification", async () => {
        const wrapper = mountPlaceholder()
        expect(wrapper.find(Placeholder).prop("dismissNotification"))
          .not.toHaveBeenCalled()
      })
    })

    /* with failed request */
    describe("with failed request", () => {

      /* Mock enhancers */
      beforeEach(() => {
        mockWithFormSubmitWithError()
      })

      /* Test: should dismiss notification */
      it("should dismiss notification", async () => {
        const wrapper = mountPlaceholder()
        expect(wrapper.find(Placeholder).prop("dismissNotification"))
          .toHaveBeenCalledWith()
      })
    })
  })
})
