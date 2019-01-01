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

import {
  enhance,
  Render
} from "components/FormInput/FormInput"

import { find } from "_/helpers"
import { Placeholder } from "_/mocks/components"

/* ----------------------------------------------------------------------------
 * Tests
 * ------------------------------------------------------------------------- */

/* Form input components */
describe("components/FormInput", () => {

  /* Render component */
  describe("<Render />", () => {

    /* Test: should render input */
    it("should render input", () => {
      const wrapper = shallow(<Render />)
      const input = find(wrapper, "TextField")
      expect(input.exists()).toBe(true)
    })

    /* Test: should render input with default type */
    it("should render input with default type", () => {
      const wrapper = shallow(<Render />)
      const input = find(wrapper, "TextField")
      expect(input.prop("type")).toEqual("text")
    })

    /* Test: should render input with default margin */
    it("should render input with default margin", () => {
      const wrapper = shallow(<Render />)
      const input = find(wrapper, "TextField")
      expect(input.prop("margin")).toEqual("dense")
    })

    /* Test: should render input with full width */
    it("should render input with full width", () => {
      const wrapper = shallow(<Render />)
      const input = find(wrapper, "TextField")
      expect(input.prop("fullWidth")).toBe(true)
    })

    /* Test: should render input with disabled auto-capitalize */
    it("should render input with disabled auto-capitalize", () => {
      const wrapper = shallow(<Render />)
      const input = find(wrapper, "TextField")
      expect(input.prop("autoCapitalize")).toEqual("false")
    })

    /* Test: should render input with disabled auto-correct */
    it("should render input with disabled auto-correct", () => {
      const wrapper = shallow(<Render />)
      const input = find(wrapper, "TextField")
      expect(input.prop("autoCorrect")).toEqual("false")
    })

    /* Test: should render input without asterisk */
    it("should render input without asterisk", () => {
      const wrapper = shallow(<Render />)
      const input = find(wrapper, "TextField")
      expect(input.prop("InputLabelProps")).toEqual({
        required: false
      })
    })
  })

  /* Form input component */
  describe("<FormInput />", () => {

    /* Mount placeholder wrapped with enhancer */
    function mountPlaceholder() {
      const Component = enhance()(Placeholder)
      return mount(<Component />)
    }
    /* Test: should render with display name */
    it("should render with display name", () => {
      const wrapper = mountPlaceholder()
      expect(wrapper.find(Placeholder).name())
        .toEqual("FormInput")
    })
  })
})
