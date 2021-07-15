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
  Render,
  RenderProps,
  enhance
} from "components/TextLink/TextLink"
import { withNotification } from "enhancers"

import { chance, find } from "_/helpers"
import { Placeholder } from "_/mocks/components"
import { mockWithNotification } from "_/mocks/enhancers"

/* ----------------------------------------------------------------------------
 * Tests
 * ------------------------------------------------------------------------- */

/* Text link components */
describe("components/TextLink", () => {

  /* Render component */
  describe("<Render />", () => {

    /* Render properties */
    const props: RenderProps = {
      classes: {
        root: chance.string()
      },
      to: chance.string(),
      handleClickCapture: jest.fn()
    }

    /* Test: should render link */
    it("should render link", () => {
      const wrapper = shallow(<Render {...props} />)
      const link = find(wrapper, "Link")
      expect(link.exists()).toBe(true)
    })

    /* Test: should render input with click capture handler */
    it("should render input with click capture handler", () => {
      const wrapper = shallow(<Render {...props} />)
      const link = find(wrapper, "Link")
      expect(link.prop("onClickCapture")).toEqual(props.handleClickCapture)
    })

    /* Test: should render children */
    it("should render children", () => {
      const wrapper = shallow(<Render {...props}>__CHILDREN__</Render>)
      const link = find(wrapper, "Link")
      expect(link.children().length).toEqual(1)
    })
  })

  /* Text link component */
  describe("TextLink", () => {

    /* Mount placeholder wrapped with enhancer */
    function mountPlaceholder() {
      const Component = compose<RenderProps, {}>(
        withNotification(),
        enhance()
      )(Placeholder)
      return mount(<Component />)
    }

    /* Mock enhancers */
    beforeEach(() => {
      mockWithNotification()
    })

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
        .toEqual("TextLink")
    })

    /* { handleClickCapture } */
    describe("{ handleClickCapture }", () => {

      /* Test: should toggle remember me */
      it("should invoke change handler", () => {
        const wrapper = mountPlaceholder()
        const handleClickCapture =
          wrapper.find(Placeholder).prop("handleClickCapture")
        handleClickCapture()
        wrapper.update()
      })
    })
  })
})
