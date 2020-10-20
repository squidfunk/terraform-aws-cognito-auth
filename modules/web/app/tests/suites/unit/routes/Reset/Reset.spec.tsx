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
  Render,
  RenderProps,
  enhance
} from "routes/Reset/Reset"

import { chance, find } from "_/helpers"
import {
  Placeholder,
  mockComponent
} from "_/mocks/components"
import {
  mockWithForm,
  mockWithFormSubmit
} from "_/mocks/enhancers"

/* ----------------------------------------------------------------------------
 * Tests
 * ------------------------------------------------------------------------- */

/* Password reset components */
describe("routes/Reset", () => {

  /* Render component */
  describe("<Render />", () => {

    /* Render properties */
    const props: RenderProps = {
      classes: {
        authenticate: chance.string(),
        button: chance.string()
      },
      form: {
        pending: false,
        success: false
      },
      setForm: jest.fn(),
      submit: jest.fn(),
      request: {
        username: chance.string()
      },
      setRequest: jest.fn(),
      handleChange: jest.fn(),
      handleSubmit: jest.fn()
    }

    /* Mock components */
    beforeEach(() => {
      mockComponent("Form")
      mockComponent("FormButton")
      mockComponent("FormPassword")
      mockComponent("Notification")
      mockComponent("TextLink")
    })

    /* Test: should render notification */
    it("should render notification", async () => {
      const wrapper = shallow(<Render {...props} />)
      const notification = find(wrapper, "Notification")
      expect(notification.exists()).toBe(true)
    })

    /* Test: should render form */
    it("should render form", () => {
      const wrapper = shallow(<Render {...props} />)
      const form = find(wrapper, "Form")
      expect(form.exists()).toBe(true)
    })

    /* Test: should render form with submit handler */
    it("should render form with submit handler", () => {
      const wrapper = shallow(<Render {...props} />)
      const form = find(wrapper, "Form")
      expect(form.prop("onSubmit")).toBe(props.handleSubmit)
    })

    /* Test: should render username input */
    it("should render username input", () => {
      const wrapper = shallow(<Render {...props} />)
      const input = find(wrapper, "FormInput")
      expect(input.exists()).toBe(true)
    })

    /* Test: should render username input required */
    it("should render username input required", () => {
      const wrapper = shallow(<Render {...props} />)
      const input = find(wrapper, "FormInput")
      expect(input.prop("required")).toBe(true)
    })

    /* Test: should render username input with name */
    it("should render username input with name", () => {
      const wrapper = shallow(<Render {...props} />)
      const input = find(wrapper, "FormInput")
      expect(input.prop("name")).toEqual("username")
    })

    /* Test: should render username input with current value */
    it("should render username input with current value", () => {
      const wrapper = shallow(<Render {...props} />)
      const input = find(wrapper, "FormInput")
      expect(input.prop("value")).toBe(props.request.username)
    })

    /* Test: should render username input change handler */
    it("should render username input with change handler", () => {
      const wrapper = shallow(<Render {...props} />)
      const input = find(wrapper, "FormInput")
      expect(input.prop("onChange")).toBe(props.handleChange)
    })

    /* Test: should render button */
    it("should render button", () => {
      const wrapper = shallow(<Render {...props} />)
      const button = find(wrapper, "FormButton")
      expect(button.exists()).toBe(true)
    })

    /* Test: should render link to '/' */
    it("should render link to '/'", () => {
      const wrapper = shallow(<Render {...props} />)
      const link = find(wrapper, "TextLink[to='/']")
      expect(link.exists()).toBe(true)
    })

    /* with unsent or failed request */
    describe("with unsent or failed request", () => {

      /* Test: should not render username input disabled */
      it("should not render username input disabled", () => {
        const wrapper = shallow(<Render {...props} />)
        const input = find(wrapper, "FormInput")
        expect(input.prop("disabled")).toBe(false)
      })

      /* Test: should not render button disabled */
      it("should not render button disabled", () => {
        const wrapper = shallow(<Render {...props} />)
        const button = find(wrapper, "FormButton")
        expect(button.prop("disabled")).toBe(false)
      })
    })

    /* with pending request */
    describe("with pending request", () => {

      /* Additional render properties */
      const addon: Partial<RenderProps> = {
        form: {
          pending: true,
          success: false
        }
      }

      /* Test: should render username input read-only */
      it("should render username input read-only", () => {
        const wrapper = shallow(<Render {...props} {...addon} />)
        const input = find(wrapper, "FormInput")
        expect(input.prop("InputProps")).toEqual({ readOnly: true })
      })

      /* Test: should render button disabled */
      it("should render button disabled", () => {
        const wrapper = shallow(<Render {...props} {...addon} />)
        const button = find(wrapper, "FormButton")
        expect(button.prop("disabled")).toBe(true)
      })
    })

    /* with successful request */
    describe("with successful request", () => {

      /* Additional render properties */
      const addon: Partial<RenderProps> = {
        form: {
          pending: false,
          success: true
        }
      }

      /* Test: should render username input disabled */
      it("should render username input disabled", () => {
        const wrapper = shallow(<Render {...props} {...addon} />)
        const input = find(wrapper, "FormInput")
        expect(input.prop("disabled")).toBe(true)
      })

      /* Test: should render button disabled */
      it("should render button disabled", () => {
        const wrapper = shallow(<Render {...props} {...addon} />)
        const button = find(wrapper, "FormButton")
        expect(button.prop("disabled")).toBe(true)
      })
    })
  })

  /* Password reset component */
  describe("<Reset />", () => {

    /* Mount placeholder wrapped with enhancer */
    function mountPlaceholder() {
      const Component = enhance()(Placeholder)
      return mount(<Component />)
    }

    /* Test: should not set request target URL */
    it("should not set request target URL", () => {
      mockWithFormSubmit()
      const withFormMock = mockWithForm()
      mountPlaceholder()
      expect(withFormMock).not.toHaveBeenCalledWith(
        jasmine.objectContaining({
          target: jasmine.any(String)
        }))
    })

    /* Test: should set request success message */
    it("should set request success message", () => {
      mockWithFormSubmit()
      const withFormMock = mockWithForm()
      mountPlaceholder()
      expect(withFormMock).toHaveBeenCalledWith(
        jasmine.objectContaining({
          message: jasmine.any(String)
        }))
    })

    /* Test: should not set request authorization flag */
    it("should not set request authorization flag", () => {
      mockWithFormSubmit()
      const withFormMock = mockWithForm()
      mountPlaceholder()
      expect(withFormMock).not.toHaveBeenCalledWith(
        jasmine.objectContaining({
          authorize: true
        }))
    })

    /* Test: should initialize request payload */
    it("should initialize request payload", () => {
      mockWithFormSubmit()
      const withFormMock = mockWithForm()
      mountPlaceholder()
      expect(withFormMock).toHaveBeenCalledWith(
        jasmine.objectContaining({
          initial: {
            username: ""
          }
        }))
    })

    /* Test: should render with styles */
    it("should render with styles", () => {
      mockWithFormSubmit()
      mockWithForm()
      const wrapper = mountPlaceholder()
      expect(wrapper.find(Placeholder).prop("classes"))
        .toBeDefined()
    })

    /* Test: should render with display name */
    it("should render with display name", () => {
      mockWithFormSubmit()
      mockWithForm()
      const wrapper = mountPlaceholder()
      expect(wrapper.find(Placeholder).name())
        .toEqual("Reset")
    })
  })
})
