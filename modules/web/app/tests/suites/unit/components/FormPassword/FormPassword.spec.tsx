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

import {
  mount,
  shallow,
  StatelessComponent
} from "enzyme"
import * as React from "react"

import {
  FormPassword,
  Render,
  RenderProps
} from "components/FormPassword/FormPassword"

import { search } from "_/helpers"
import {
  mockMouseDownEvent
} from "_/mocks/vendor/browser/events"

/* ----------------------------------------------------------------------------
 * Tests
 * ------------------------------------------------------------------------- */

/* Form password component */
describe("components/FormPassword", () => {

  /* Render component */
  describe("Render", () => {

    /* Default props */
    const props: RenderProps = {
      classes: {
        adornment: "__ADORNMENT__"
      },
      visibility: false,
      setVisibility: jest.fn(),
      handleClick: jest.fn(),
      handleMouseDown: jest.fn()
    }

    /* Test: should render with default props */
    it("should render with default props", () => {
      const wrapper = shallow(<Render {...props} />)
      expect(wrapper).toMatchSnapshot()
    })

    /* Test: should render with helper text */
    it("should render with helper text", () => {
      const wrapper = shallow(
        <Render {...props} helperText="__HELPER_TEXT__" />
      )
      expect(wrapper).toMatchSnapshot()
    })

    /* Test: should render as plain-text */
    it("should render as plain-text", () => {
      const wrapper = shallow(
        <Render {...props} visibility={true}
      />)
      expect(wrapper).toMatchSnapshot()
    })

    /* Test: should render as read-only */
    it("should render as read-only", () => {
      const wrapper = shallow(
        <Render {...props} InputProps={{ readOnly: true }}
      />)
      expect(wrapper).toMatchSnapshot()
    })
  })

  /* Enhanced component */
  describe("FormPassword", () => {

    /* Test: should render with default props */
    it("should render with default props", () => {
      const wrapper = shallow(<FormPassword />)
      expect(search(wrapper, Render)).toMatchSnapshot()
    })

    /* { visibility } */
    describe("{ visibility }", () => {

      /* Mount component */
      const wrapper = mount(<FormPassword />)

      /* Visibility state */
      const visibility = wrapper
        .find(Render as StatelessComponent<RenderProps>)
        .prop("visibility")

      /* Test: should initialize form submission state */
      it("should initialize visibility state", () => {
        expect(visibility).toEqual(false)
      })
    })

    /* { setVisibility } */
    describe("{ setVisibility }", () => {

      /* Mount component */
      const wrapper = mount(<FormPassword />)

      /* Visibility state reducer */
      const setVisibility = wrapper
        .find(Render as StatelessComponent<RenderProps>)
        .prop("setVisibility")

      /* Test: should update visibility state */
      it("should update visibility state", () => {
        setVisibility(true)
        wrapper.update()
        expect(
          wrapper
            .find(Render as StatelessComponent<RenderProps>)
            .prop("visibility")
        )
          .toEqual(true)
      })
    })

    /* { handleClick } */
    describe("{ handleClick }", () => {

      /* Mount component */
      const wrapper = mount(<FormPassword />)

      /* Visibility click handler */
      const handleClick = wrapper
        .find(Render as StatelessComponent<RenderProps>)
        .prop("handleClick")

      /* Test: should toggle visibility */
      it("should toggle visibility", () => {
        handleClick()
        wrapper.update()
        expect(
          wrapper
            .find(Render as StatelessComponent<RenderProps>)
            .prop("visibility")
        )
          .toEqual(true)
      })
    })

    /* { handleMouseDown } */
    describe("{ handleMouseDown }", () => {

      /* Mount component */
      const wrapper = mount(<FormPassword />)

      /* Visibility mouse down handler */
      const handleMouseDown = wrapper
        .find(Render as StatelessComponent<RenderProps>)
        .prop("handleMouseDown")

      /* Test: should prevent interference with click event */
      it("should prevent interference with click event", () => {
        const ev = mockMouseDownEvent()
        handleMouseDown(ev)
        expect(ev.preventDefault).toHaveBeenCalledWith()
      })
    })
  })
})
