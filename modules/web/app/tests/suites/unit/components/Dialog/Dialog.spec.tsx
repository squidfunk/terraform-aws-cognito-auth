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
} from "components/Dialog/Dialog"

import { chance, search } from "_/helpers"

/* ----------------------------------------------------------------------------
 * Tests
 * ------------------------------------------------------------------------- */

/* Dialog component */
describe("components/Dialog", () => {

  /* Render component */
  describe("<Render />", () => {

    /* Shallow-render component */
    const wrapper = shallow(
      <Render classes={{ root: chance.string() }}>
        __CHILDREN__
      </Render>
    )

    /* Test: should render paper */
    it("should render paper", () => {
      const paper = search(wrapper, "Paper")
      expect(paper.exists()).toBe(true)
    })

    /* Test: should render children */
    it("should render children", () => {
      const paper = search(wrapper, "Paper")
      expect(paper.children().length).toEqual(1)
    })
  })

  /* Dialog */
  describe("<Dialog />", () => {

    /* Enhance component */
    const Dialog = enhance()(Render)

    /* Test: should render with styles */
    it("should render with styles", () => {
      const wrapper = shallow(<Dialog />)
      const component = search(wrapper, Render)
      expect(component.prop<RenderProps>("classes")).toBeDefined()
    })

    /* Test: should render with display name */
    it("should render with display name", () => {
      const wrapper = shallow(<Dialog />)
      const component = search(wrapper, Render)
      expect(component.name()).toEqual("Dialog")
    })
  })
})
