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

import {
  enhance,
  Render,
  RenderProps
} from "components/FormButton/FormButton"

import { chance, find } from "_/helpers"
import { Placeholder } from "_/mocks/components"

/* ----------------------------------------------------------------------------
 * Tests
 * ------------------------------------------------------------------------- */

/* Form button components */
describe("components/FormButton", () => {

  /* Render component */
  describe("<Render />", () => {

    /* Render properties */
    const props: RenderProps = {
      classes: {
        root: chance.string()
      },
      children: chance.string()
    }

    /* Test: should render form */
    it("should render form", () => {
      const wrapper = shallow(<Render {...props} />)
      const button = find(wrapper, "Button")
      expect(button.exists()).toBe(true)
    })

    /* Test: should render button with default type */
    it("should render button with default type", () => {
      const wrapper = shallow(<Render {...props} />)
      const button = find(wrapper, "Button")
      expect(button.prop("type")).toEqual("submit")
    })

    /* Test: should render button with default variant */
    it("should render button with default variant", () => {
      const wrapper = shallow(<Render {...props} />)
      const button = find(wrapper, "Button")
      expect(button.prop("variant")).toEqual("contained")
    })

    /* Test: should render button with default color */
    it("should render button with default color", () => {
      const wrapper = shallow(<Render {...props} />)
      const button = find(wrapper, "Button")
      expect(button.prop("color")).toEqual("primary")
    })

    /* Test: should render button with full width */
    it("should render button with full width", () => {
      const wrapper = shallow(<Render {...props} />)
      const button = find(wrapper, "Button")
      expect(button.prop("fullWidth")).toBe(true)
    })
  })

  /* Form button component */
  describe("<FormButton />", () => {

    /* Mount placeholder wrapped with enhancer */
    function mountPlaceholder() {
      const Component = enhance()(Placeholder)
      return mount(<Component />)
    }

    /* Test: should render with styles */
    it("should render with styles", () => {
      const wrapper = mountPlaceholder()
      expect(wrapper.find(Placeholder).prop("classes"))
        .toBeDefined()
    })

    /* Test: should render with display name */
    it("should render with display name", () => {
      const wrapper = mountPlaceholder()
      expect(wrapper.find(Placeholder).name())
        .toEqual("FormButton")
    })
  })
})
