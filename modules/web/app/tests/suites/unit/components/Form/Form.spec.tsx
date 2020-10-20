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
  FormProps,
  Render,
  RenderProps,
  enhance
} from "components/Form/Form"

import { chance, find } from "_/helpers"
import { Placeholder } from "_/mocks/components"

/* ----------------------------------------------------------------------------
 * Tests
 * ------------------------------------------------------------------------- */

/* Form components */
describe("components/Form", () => {

  /* Render component */
  describe("<Render />", () => {

    /* Render properties */
    const props: RenderProps = {
      classes: {
        root: chance.string()
      },
      onSubmit: jest.fn()
    }

    /* Test: should render form */
    it("should render form", () => {
      const wrapper = shallow(<Render {...props} />)
      const form = find(wrapper, "form")
      expect(form.exists()).toBe(true)
    })

    /* Test: should render form */
    it("should render form", () => {
      const wrapper = shallow(<Render {...props} />)
      const form = find(wrapper, "form")
      expect(form.prop("autoComplete")).toEqual("off")
    })

    /* Test: should render children */
    it("should render children", () => {
      const wrapper = shallow(<Render {...props}>__CHILDREN__</Render>)
      const form = find(wrapper, "form")
      expect(form.children().length).toEqual(1)
    })
  })

  /* Form component */
  describe("<Form />", () => {

    /* Mount placeholder wrapped with enhancer */
    function mountPlaceholder(componentProps: FormProps) {
      const Component = enhance()(Placeholder)
      return mount(<Component {...componentProps} />)
    }

    /* Component properties */
    const props: FormProps = {
      onSubmit: jest.fn()
    }

    /* Test: should render with styles */
    it("should render with styles", () => {
      const wrapper = mountPlaceholder(props)
      expect(wrapper.find(Placeholder).prop("classes"))
        .toBeDefined()
    })

    /* Test: should render with submit handler */
    it("should render with submit handler", () => {
      const wrapper = mountPlaceholder(props)
      expect(wrapper.find(Placeholder).prop("onSubmit"))
        .toBe(props.onSubmit)
    })

    /* Test: should render with display name */
    it("should render with display name", () => {
      const wrapper = mountPlaceholder(props)
      expect(wrapper.find(Placeholder).name())
        .toEqual("Form")
    })
  })
})
