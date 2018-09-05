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

import { mount } from "enzyme"
import * as React from "react"

import {
  enhance,
  Render
} from "routes/Authenticate/Authenticate"
import {
  AuthenticateWithCredentials
} from "routes/Authenticate/AuthenticateWithCredentials"
import {
  AuthenticateWithToken
} from "routes/Authenticate/AuthenticateWithToken"

import { Placeholder } from "_/mocks/components"
import { mockWithRememberMe } from "_/mocks/enhancers"
import { mockRenderComponent } from "_/mocks/vendor/recompose"

/* ----------------------------------------------------------------------------
 * Tests
 * ------------------------------------------------------------------------- */

/* Authentication components */
describe("routes/Authenticate", () => {

  /* Render component */
  describe("<Render />", () => {

    /* Test: should render <AuthenticateWithCredentials /> */
    it("should render <AuthenticateWithCredentials />", () => {
      expect(Render).toBe(AuthenticateWithCredentials)
    })
  })

  /* Authentication component */
  describe("<Authenticate />", () => {

    /* Mount placeholder wrapped with enhancer */
    function mountPlaceholder() {
      const Component = enhance()(Placeholder)
      return mount(<Component />)
    }

    /* Test: should render <Render /> */
    it("should render <Render />", () => {
      mockWithRememberMe()
      const wrapper = mountPlaceholder()
      expect(wrapper.find(Placeholder).exists()).toBe(true)
    })

    /* with remember me */
    describe("with remember me", () => {

      /* Test: should render <AuthenticateWithToken /> */
      it("should render <AuthenticateWithToken />", () => {
        mockWithRememberMe({ active: false })
        const renderComponentMock = mockRenderComponent()
        mountPlaceholder()
        expect(renderComponentMock)
          .toHaveBeenCalledWith(AuthenticateWithToken)
      })
    })

    /* with failed re-authentication */
    describe("with failed re-authentication", () => {

      /* Test: should render <Render /> */
      it("should render <Render />", () => {
        mockWithRememberMe({ active: true, result: false })
        const wrapper = mountPlaceholder()
        expect(wrapper.find(Placeholder).exists()).toBe(true)
      })
    })
  })
})
