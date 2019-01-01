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

import { withRememberMe } from "enhancers"
import {
  AuthenticateSuccess
} from "routes/Authenticate/AuthenticateSuccess"
import {
  enhance,
  Render
} from "routes/Authenticate/AuthenticateWithToken"

import { find, wait } from "_/helpers"
import {
  mockComponent,
  Placeholder
} from "_/mocks/components"
import {
  mockWithFormSubmit,
  mockWithFormSubmitWithError,
  mockWithFormSubmitWithResult,
  mockWithNotification,
  mockWithRememberMe
} from "_/mocks/enhancers"
import { mockRenderComponent } from "_/mocks/vendor/recompose"

/* ----------------------------------------------------------------------------
 * Tests
 * ------------------------------------------------------------------------- */

/* Authenticate with refresh token components */
describe("routes/AuthenticateWithToken", () => {

  /* Render component */
  describe("<Render />", () => {

    /* Mock components */
    beforeEach(() => {
      mockComponent("Loading")
    })

    /* Test: should render loading indicator */
    it("should render loading indicator", () => {
      const wrapper = shallow(<Render />)
      const loading = find(wrapper, "Loading")
      expect(loading.exists()).toBe(true)
    })
  })

  /* Authenticate with refresh token component */
  describe("<AuthenticateWithToken />", () => {

    /* Mount placeholder wrapped with enhancer */
    function mountPlaceholder() {
      const Component = compose(
        withRememberMe(),
        enhance()
      )(Placeholder)
      return mount(<Component />)
    }

    /* Mock enhancers */
    beforeEach(() => {
      mockWithRememberMe()
      mockWithNotification()
    })

    /* Test: should set request target URL */
    it("should set request target URL", () => {
      const withFormSubmitMock = mockWithFormSubmit()
      mountPlaceholder()
      expect(withFormSubmitMock).toHaveBeenCalledWith(
        jasmine.objectContaining({
          target: "/authenticate"
        }))
    })

    /* Test: should not set request authorization flag */
    it("should not set request authorization flag", () => {
      const withFormSubmitMock = mockWithFormSubmit()
      mountPlaceholder()
      expect(withFormSubmitMock).not.toHaveBeenCalledWith(
        jasmine.objectContaining({
          authorize: true
        }))
    })

    /* Test: should submit request after mount */
    it("should submit request after mount", () => {
      mockWithFormSubmit()
      const wrapper = mountPlaceholder()
      expect(wrapper.find(Placeholder).prop("submit"))
        .toHaveBeenCalledWith()
    })

    /* Test: should dismiss notification */
    it("should dismiss notification", async () => {
      mockWithFormSubmit()
      const wrapper = mountPlaceholder()
      await wait(250)
      expect(wrapper.find(Placeholder).prop("dismissNotification"))
        .toHaveBeenCalledWith()
    })

    /* Test: should render with display name */
    it("should render with display name", () => {
      mockWithFormSubmit()
      const wrapper = mountPlaceholder()
      expect(wrapper.find(Placeholder).name())
        .toEqual("AuthenticateWithToken")
    })

    /* with successful request */
    describe("with successful request", () => {

      /* Mock enhancers */
      beforeEach(() => {
        mockWithFormSubmitWithResult()
      })

      /* Test: should render <AuthenticateSuccess /> */
      it("should render <AuthenticateSuccess />", async () => {
        const renderComponentMock = mockRenderComponent()
        mountPlaceholder()
        await wait(250)
        expect(renderComponentMock)
          .toHaveBeenCalledWith(AuthenticateSuccess)
      })
    })

    /* with failed request */
    describe("with failed request", () => {

      /* Mock enhancers */
      beforeEach(() => {
        mockWithFormSubmitWithError()
      })

      /* Test: should indicate failed re-authentication */
      it("should indicate failed re-authentication", async () => {
        const wrapper = mountPlaceholder()
        await wait(250)
        expect(wrapper.find(Placeholder).prop("setRememberMeResult"))
          .toHaveBeenCalledWith(false)
      })
    })
  })
})
