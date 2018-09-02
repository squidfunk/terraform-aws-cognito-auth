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

import { search } from "_/helpers"
import {
  Header,
  Render,
  RenderProps
} from "components/Header/Header"

/* ----------------------------------------------------------------------------
 * Tests
 * ------------------------------------------------------------------------- */

/* Header component */
describe("components/Header", () => {

  /* Render component */
  describe("Render", () => {

    /* Default props */
    const props: RenderProps = {
      classes: {
        root: "__ROOT__",
        text: "__TEXT__"
      },
      primary: "__PRIMARY__",
      secondary: "__SECONDARY__"
    }

    /* Test: should render with default props */
    it("should render with default props", () => {
      const wrapper = shallow(<Render {...props} />)
      expect(wrapper).toMatchSnapshot()
    })
  })

  /* Enhanced component */
  describe("Header", () => {

    /* Test: should render with default props */
    it("should render with default props", () => {
      const wrapper = shallow(
        <Header primary="__PRIMARY__" secondary="__SECONDARY__" />
      )
      expect(search(wrapper, Render)).toMatchSnapshot()
    })
  })
})
