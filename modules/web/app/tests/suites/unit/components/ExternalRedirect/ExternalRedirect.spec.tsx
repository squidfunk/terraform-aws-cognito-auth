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
import * as React from "react"

import {
  enhance,
  Render,
  RenderProps
} from "components/ExternalRedirect/ExternalRedirect"

import { chance, search } from "_/helpers"
import { mockLocationAssign } from "_/mocks/vendor/browser/location"

/* ----------------------------------------------------------------------------
 * Tests
 * ------------------------------------------------------------------------- */

/* External redirect component */
describe("components/ExternalRedirect", () => {

  /* Render component */
  describe("<Render />", () => {

    /* Shallow-render component */
    const wrapper = shallow(<Render href={chance.string()} />)

    /* Test: should render loading indicator */
    it("should render loading indicator", () => {
      const loading = search(wrapper, "Loading")
      expect(loading.exists()).toBe(true)
      expect(loading.props()).toEqual({})
    })
  })

  /* External redirect */
  describe("<ExternalRedirect />", () => {

    /* Enhance component */
    const ExternalRedirect = enhance()(Render)

    /* Target URL */
    const href = chance.url()

    /* Test: should render with target URL */
    it("should render with target URL", () => {
      mockLocationAssign()
      const wrapper = shallow(<ExternalRedirect href={href} />)
      const component = search(wrapper, Render)
      expect(component.prop<RenderProps>("href")).toEqual(href)
    })

    /* Test: should redirect after mount */
    it("should redirect after mount", () => {
      const assignMock = mockLocationAssign()
      shallow(<ExternalRedirect href={href} />)
      expect(assignMock).toHaveBeenCalled()
    })
  })
})
