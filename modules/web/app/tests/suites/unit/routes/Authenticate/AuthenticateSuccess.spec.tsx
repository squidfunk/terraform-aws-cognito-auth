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

import { mount, shallow } from "enzyme"
import * as React from "react"
import { compose } from "recompose"

import {
  withFormSubmit,
  withRememberMe
} from "enhancers"
import {
  Render,
  enhance
} from "routes/Authenticate/AuthenticateSuccess"

import { find } from "_/helpers"
import { mockSession } from "_/mocks/common"
import {
  Placeholder,
  mockComponent
} from "_/mocks/components"
import {
  mockWithCallback,
  mockWithFormSubmitWithResult,
  mockWithRememberMe,
  mockWithSession
} from "_/mocks/enhancers"

/* ----------------------------------------------------------------------------
 * Tests
 * ------------------------------------------------------------------------- */

/* Authentication success components */
describe("routes/AuthenticateSuccess", () => {

  /* Render component */
  describe("<Render />", () => {

    /* Mock components */
    beforeEach(() => {
      mockComponent("Loading")
    })

    /* Test: should not render loading indicator (again) */
    it("should not render loading indicator (again)", () => {
      const wrapper = shallow(<Render />)
      expect(find(wrapper, "Loading")).toBeUndefined()
    })
  })

  /* Authentication success component */
  describe("<AuthenticateSuccess />", () => {

    /* Mount placeholder wrapped with enhancer */
    function mountPlaceholder() {
      const Component = compose(
        withRememberMe(),
        withFormSubmit(),
        enhance()
      )(Placeholder)
      return mount(<Component />)
    }

    /* Session */
    const session = mockSession()

    /* Mock enhancers */
    beforeEach(() => {
      mockWithRememberMe()
      mockWithCallback()
    })

    /* Test: should initialize session */
    it("should initialize session", async () => {
      mockWithFormSubmitWithResult(session)
      mockWithSession({ ...session, renewed: true })
      const wrapper = mountPlaceholder()
      expect(wrapper.find(Placeholder).prop("initSession"))
        .toHaveBeenCalledWith(session)
    })

    /* Test: should not indicate successful re-authentication */
    it("should not indicate successful re-authentication", async () => {
      mockWithFormSubmitWithResult(session)
      mockWithSession({ ...session, renewed: true })
      const wrapper = mountPlaceholder()
      expect(wrapper.find(Placeholder).prop("setRememberMeFailed"))
        .not.toHaveBeenCalled()
    })

    /* Test: should invoke callback with identity token */
    it("should invoke callback with identity token", () => {
      mockWithFormSubmitWithResult(session)
      mockWithSession({ ...session, renewed: true })
      const wrapper = mountPlaceholder()
      wrapper.setProps({})
      expect(wrapper.find(Placeholder).prop("callback"))
        .toHaveBeenCalledWith(session.id)
    })

    /* Test: should render with display name */
    it("should render with display name", () => {
      mockWithFormSubmitWithResult(session)
      mockWithSession({ ...session, renewed: true })
      const wrapper = mountPlaceholder()
      expect(wrapper.find(Placeholder).name())
        .toEqual("AuthenticateSuccess")
    })

    /* with remember me */
    describe("with remember me", () => {

      /* Test: should indicate successful re-authentication */
      it("should indicate successful re-authentication", async () => {
        mockWithFormSubmitWithResult(mockSession(true))
        mockWithSession({ ...session, renewed: true })
        const wrapper = mountPlaceholder()
        expect(wrapper.find(Placeholder).prop("setRememberMeFailed"))
          .not.toHaveBeenCalled()
      })
    })

    /* with corrupted session */
    describe("with corrupted session", () => {

      /* Test: should not initialize session */
      it("should not initialize session", async () => {
        mockWithFormSubmitWithResult()
        mockWithSession({ ...session, renewed: true })
        const wrapper = mountPlaceholder()
        expect(wrapper.find(Placeholder).prop("initSession"))
          .not.toHaveBeenCalled()
      })

      /* Test: should not invoke callback */
      it("should not invoke callback", () => {
        mockWithFormSubmitWithResult(session)
        mockWithSession(session)
        const wrapper = mountPlaceholder()
        wrapper.setProps({})
        expect(wrapper.find(Placeholder).prop("callback"))
          .not.toHaveBeenCalled()
      })
    })
  })
})
