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
} from "components/FormPassword/FormPassword"

import { chance, find } from "_/helpers"
import { Placeholder } from "_/mocks/components"
import { mockMouseDownEvent } from "_/mocks/vendor/browser/events"

/* ----------------------------------------------------------------------------
 * Tests
 * ------------------------------------------------------------------------- */

/* Form password components */
describe("components/FormPassword", () => {

  /* Render component */
  describe("<Render />", () => {

    /* Render properties */
    const props: RenderProps = {
      classes: {
        adornment: chance.string()
      },
      visibility: false,
      setVisibility: jest.fn(),
      handleClick: jest.fn(),
      handleMouseDown: jest.fn()
    }

    /* Test: should render form control */
    it("should render form control", () => {
      const wrapper = shallow(<Render {...props} />)
      const control = find(wrapper, "FormControl")
      expect(control.exists()).toBe(true)
    })

    /* Test: should render form control with default margin */
    it("should render form control with default margin", () => {
      const wrapper = shallow(<Render {...props} />)
      const control = find(wrapper, "FormControl")
      expect(control.prop("margin")).toEqual("dense")
    })

    /* Test: should render form control with full width */
    it("should render form control with full width", () => {
      const wrapper = shallow(<Render {...props} />)
      const control = find(wrapper, "FormControl")
      expect(control.prop("fullWidth")).toBe(true)
    })

    /* Test: should render form control with error */
    it("should render form control with error", () => {
      const error = chance.bool()
      const wrapper = shallow(<Render {...props} error={error} />)
      const control = find(wrapper, "FormControl")
      expect(control.prop("error")).toBe(error)
    })

    /* Test: should render form helper text */
    it("should render form helper text", () => {
      const helperText = chance.string()
      const wrapper = shallow(<Render {...props} helperText={helperText} />)
      const helper = find(wrapper, "FormHelperText")
      expect(helper.exists()).toBe(true)
    })

    /* Test: should render input label */
    it("should render input label", () => {
      const wrapper = shallow(<Render {...props} />)
      const label = find(wrapper, "InputLabel")
      expect(label.exists()).toBe(true)
    })

    /* Test: should render input label with input link */
    it("should render input label with input link", () => {
      const name = chance.string()
      const wrapper = shallow(<Render {...props} name={name} />)
      const label = find(wrapper, "InputLabel")
      expect(label.prop("htmlFor")).toEqual(name)
    })

    /* Test: should render input label without asterisk */
    it("should render input label without asterisk", () => {
      const wrapper = shallow(<Render {...props} />)
      const label = find(wrapper, "InputLabel")
      expect(label.prop("required")).toBe(false)
    })

    /* Test: should render input */
    it("should render input", () => {
      const wrapper = shallow(<Render {...props} />)
      const input = find(wrapper, "Input")
      expect(input.exists()).toBe(true)
    })

    /* Test: should render input with name */
    it("should render input with name", () => {
      const name = chance.string()
      const wrapper = shallow(<Render {...props} name={name} />)
      const input = find(wrapper, "Input")
      expect(input.prop("id")).toEqual(name)
      expect(input.prop("name")).toEqual(name)
    })

    /* Test: should render input with password type */
    it("should render input with password type", () => {
      const wrapper = shallow(<Render {...props} visibility={false} />)
      const input = find(wrapper, "Input")
      expect(input.prop("type")).toEqual("password")
    })

    /* Test: should render input with text type */
    it("should render input with text type", () => {
      const wrapper = shallow(<Render {...props} visibility={true} />)
      const input = find(wrapper, "Input")
      expect(input.prop("type")).toEqual("text")
    })

    /* Test: should render input with current value */
    it("should render input with current value", () => {
      const value = chance.string()
      const wrapper = shallow(<Render {...props} value={value} />)
      const input = find(wrapper, "Input")
      expect(input.prop("value")).toEqual(value)
    })

    /* Test: should render input with change handler */
    it("should render input with change handler", () => {
      const onChange = jest.fn()
      const wrapper = shallow(<Render {...props} onChange={onChange} />)
      const input = find(wrapper, "Input")
      expect(input.prop("onChange")).toEqual(onChange)
    })

    /* Test: should render input required */
    it("should render input required", () => {
      const required = chance.bool()
      const wrapper = shallow(<Render {...props} required={required} />)
      const input = find(wrapper, "Input")
      expect(input.prop("required")).toEqual(required)
    })

    /* Test: should render input read-only */
    it("should render input read-only", () => {
      const readOnly = chance.bool()
      const wrapper = shallow(<Render {...props} InputProps={{ readOnly }} />)
      const input = find(wrapper, "Input")
      expect(input.prop("readOnly")).toEqual(readOnly)
    })

    /* Test: should render input disabled */
    it("should render input disabled", () => {
      const disabled = chance.bool()
      const wrapper = shallow(<Render {...props} disabled={disabled} />)
      const input = find(wrapper, "Input")
      expect(input.prop("disabled")).toEqual(disabled)
    })
  })

  /* Form password component */
  describe("<FormPassword />", () => {

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
        .toEqual("FormPassword")
    })

    /* { visibility } */
    describe("{ visibility }", () => {

      /* Test: should initialize visibility state */
      it("should initialize visibility state", () => {
        const wrapper = mountPlaceholder()
        expect(wrapper.find(Placeholder).prop("visibility"))
          .toEqual(false)
      })
    })

    /* { setVisibility } */
    describe("{ setVisibility }", () => {

      /* Test: should update visibility state */
      it("should update visibility state", () => {
        const wrapper = mountPlaceholder()
        const setVisibility = wrapper.find(Placeholder).prop("setVisibility")
        setVisibility(true)
        wrapper.update()
        expect(wrapper.find(Placeholder).prop("visibility"))
          .toEqual(true)
      })
    })

    /* { handleClick } */
    describe("{ handleClick }", () => {

      /* Test: should toggle visibility */
      it("should toggle visibility", () => {
        const wrapper = mountPlaceholder()
        const handleClick = wrapper.find(Placeholder).prop("handleClick")
        handleClick()
        wrapper.update()
        expect(wrapper.find(Placeholder).prop("visibility"))
          .toEqual(true)
      })
    })

    /* { handleMouseDown } */
    describe("{ handleMouseDown }", () => {

      /* Test: should prevent interference with click event */
      it("should prevent interference with click event", () => {
        const wrapper = mountPlaceholder()
        const handleMouseDown =
          wrapper.find(Placeholder).prop("handleMouseDown")
        const ev = mockMouseDownEvent()
        handleMouseDown(ev)
        expect(ev.preventDefault).toHaveBeenCalledWith()
      })
    })
  })
})
