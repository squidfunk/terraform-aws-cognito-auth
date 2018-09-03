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
} from "components/Form/Form"

import { chance, search } from "_/helpers"

/* ----------------------------------------------------------------------------
 * Tests
 * ------------------------------------------------------------------------- */

/* Form component */
describe("components/Form", () => {

  /* Render component */
  describe("<Render />", () => {

    /* Shallow-render component */
    const wrapper = shallow(
      <Render classes={{ root: chance.string() }} onSubmit={jest.fn()}>
        __CHILDREN__
      </Render>
    )

    /* Test: should render form */
    it("should render form", () => {
      const form = search(wrapper, "form")
      expect(form.exists()).toBe(true)
    })

    /* Test: should render form with disabled auto-complete */
    it("should render form with disabled auto-complete", () => {
      const form = search(wrapper, "form")
      expect(form.prop<RenderProps>("autoComplete")).toEqual("off")
    })

    /* Test: should render children */
    it("should render children", () => {
      const form = search(wrapper, "form")
      expect(form.children().length).toEqual(1)
    })
  })

  /* Form */
  describe("<Form />", () => {

    /* Enhance component */
    const Form = enhance()(Render)

    /* Form submit handler */
    const onSubmit = jest.fn()

    /* Test: should render with styles */
    it("should render with styles", () => {
      const wrapper = shallow(<Form onSubmit={onSubmit} />)
      const component = search(wrapper, Render)
      expect(component.prop<RenderProps>("classes")).toBeDefined()
    })

    /* Test: should render with submit handler */
    it("should render with submit handler", () => {
      const wrapper = shallow(<Form onSubmit={onSubmit} />)
      const component = search(wrapper, Render)
      expect(component.prop<RenderProps>("onSubmit")).toEqual(onSubmit)
    })

    /* Test: should render with display name */
    it("should render with display name", () => {
      const wrapper = shallow(<Form onSubmit={onSubmit} />)
      const component = search(wrapper, Render)
      expect(component.name()).toEqual("Form")
    })

    /* Test: should invoke handler on submit event */
    it("should invoke handler on submit event", () => {
      const wrapper = shallow(<Form onSubmit={onSubmit} />)
      wrapper.simulate("submit")
      expect(onSubmit).toHaveBeenCalled()
    })
  })
})
