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

import { withRememberMe } from "enhancers"
import {
  AuthenticateSuccess
} from "routes/Authenticate/AuthenticateSuccess"
import {
  enhance,
  Render,
  RenderProps
} from "routes/Authenticate/AuthenticateWithCredentials"

import { chance, find } from "_/helpers"
import {
  mockComponent,
  Placeholder
} from "_/mocks/components"
import {
  mockWithForm,
  mockWithFormSubmit,
  mockWithFormSubmitWithError,
  mockWithFormSubmitWithResult,
  mockWithRememberMe
} from "_/mocks/enhancers"
import { mockRenderComponent } from "_/mocks/vendor/recompose"

/* ----------------------------------------------------------------------------
 * Tests
 * ------------------------------------------------------------------------- */

/* Authenticate with credentials components */
describe("routes/AuthenticateWithCredentials", () => {

  /* Render component */
  describe("<Render />", () => {

    /* Render properties */
    const props: RenderProps = {
      classes: {
        controls: chance.string(),
        forgotPassword: chance.string(),
        register: chance.string()
      },
      form: {
        pending: false,
        success: false
      },
      setForm: jest.fn(),
      submit: jest.fn(),
      request: {
        username: chance.string(),
        password: chance.string(),
        remember: chance.bool()
      },
      setRequest: jest.fn(),
      handleChange: jest.fn(),
      handleSubmit: jest.fn()
    }

    /* Mock components */
    beforeEach(() => {
      mockComponent("Form")
      mockComponent("FormButton")
      mockComponent("FormInput")
      mockComponent("FormPassword")
      mockComponent("FormRememberMe")
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

    /* Test: should render password input */
    it("should render password input", () => {
      const wrapper = shallow(<Render {...props} />)
      const input = find(wrapper, "FormPassword")
      expect(input.exists()).toBe(true)
    })

    /* Test: should render password input required */
    it("should render password input required", () => {
      const wrapper = shallow(<Render {...props} />)
      const input = find(wrapper, "FormPassword")
      expect(input.prop("required")).toBe(true)
    })

    /* Test: should render password input with name */
    it("should render password input with name", () => {
      const wrapper = shallow(<Render {...props} />)
      const input = find(wrapper, "FormPassword")
      expect(input.prop("name")).toEqual("password")
    })

    /* Test: should render password input with current value */
    it("should render password input with current value", () => {
      const wrapper = shallow(<Render {...props} />)
      const input = find(wrapper, "FormPassword")
      expect(input.prop("value")).toBe(props.request.password)
    })

    /* Test: should render password input change handler */
    it("should render password input with change handler", () => {
      const wrapper = shallow(<Render {...props} />)
      const input = find(wrapper, "FormPassword")
      expect(input.prop("onChange")).toBe(props.handleChange)
    })

    /* Test: should render remember me */
    it("should render remember me", () => {
      const wrapper = shallow(<Render {...props} />)
      const input = find(wrapper, "[control]").prop("control")
      expect(input).not.toBeUndefined()
    })

    /* Test: should render remember me with name */
    it("should render remember me with name", () => {
      const wrapper = shallow(<Render {...props} />)
      const input = find(wrapper, "[control]").prop("control")
      expect(input.props.name).toEqual("remember")
    })

    /* Test: should render remember me with current value */
    it("should render remember me with current value", () => {
      const wrapper = shallow(<Render {...props} />)
      const input = find(wrapper, "[control]").prop("control")
      expect(input.props.checked).toBe(props.request.remember)
    })

    /* Test: should render remember me change handler */
    it("should render remember me with change handler", () => {
      const wrapper = shallow(<Render {...props} />)
      const input = find(wrapper, "[control]").prop("control")
      expect(input.props.onChange).toBe(props.handleChange)
    })

    /* Test: should render button */
    it("should render button", () => {
      const wrapper = shallow(<Render {...props} />)
      const button = find(wrapper, "FormButton")
      expect(button.exists()).toBe(true)
    })

    /* Test: should render link to '/reset' */
    it("should render link to '/reset'", () => {
      const wrapper = shallow(<Render {...props} />)
      const link = find(wrapper, "TextLink[to='/reset']")
      expect(link.exists()).toBe(true)
    })

    /* Test: should render link to '/register' */
    it("should render link to '/register'", () => {
      const wrapper = shallow(<Render {...props} />)
      const link = find(wrapper, "TextLink[to='/register']")
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

      /* Test: should not render password input disabled */
      it("should not render password input disabled", () => {
        const wrapper = shallow(<Render {...props} />)
        const input = find(wrapper, "FormPassword")
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

      /* Test: should render password input read-only */
      it("should render password input read-only", () => {
        const wrapper = shallow(<Render {...props} {...addon} />)
        const input = find(wrapper, "FormPassword")
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

      /* Test: should render password input disabled */
      it("should render password input disabled", () => {
        const wrapper = shallow(<Render {...props} {...addon} />)
        const input = find(wrapper, "FormPassword")
        expect(input.prop("disabled")).toBe(true)
      })

      /* Test: should not render button disabled */
      it("should not render button disabled", () => {
        const wrapper = shallow(<Render {...props} {...addon} />)
        const button = find(wrapper, "FormButton")
        expect(button.prop("disabled")).toBe(false)
      })
    })
  })

  /* Authenticate with credentials component */
  describe("<AuthenticateWithCredentials />", () => {

    /* Mount placeholder wrapped with enhancer */
    function mountPlaceholder() {
      const Component = compose<RenderProps, {}>(
        withRememberMe(),
        enhance()
      )(Placeholder)
      return mount(<Component />)
    }

    /* Mock enhancers */
    beforeEach(() => {
      mockWithRememberMe({ active: true })
    })

    /* Test: should set request target URL */
    it("should set request target URL", () => {
      mockWithFormSubmit()
      const withFormMock = mockWithForm()
      mountPlaceholder()
      expect(withFormMock).toHaveBeenCalledWith(
        jasmine.objectContaining({
          target: "/authenticate"
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
            username: "",
            password: "",
            remember: false
          }
        }))
    })

    /* Test: should initialize remember me after mount */
    it("should initialize remember me after mount", () => {
      mockWithFormSubmit()
      mockWithForm()
      const wrapper = mountPlaceholder()
      expect(wrapper.find(Placeholder).prop("setRequest"))
        .toHaveBeenCalledWith(jasmine.objectContaining({
          remember: true
        }))
    })

    /* Test: should prevent re-authentication */
    it("should prevent re-authentication", () => {
      mockWithFormSubmit()
      mockWithForm()
      const wrapper = mountPlaceholder()
      expect(wrapper.find(Placeholder).prop("setRememberMeResult"))
        .toHaveBeenCalledWith(false)
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
        .toEqual("AuthenticateWithCredentials")
    })

    /* with successful request */
    describe("with successful request", () => {

      /* Mock enhancers */
      beforeEach(() => {
        mockWithFormSubmitWithResult()
        mockWithForm()
      })

      /* Test: should render <AuthenticateSuccess /> */
      it("should render <AuthenticateSuccess />", async () => {
        const renderComponentMock = mockRenderComponent()
        mountPlaceholder()
        expect(renderComponentMock)
          .toHaveBeenCalledWith(AuthenticateSuccess)
      })
    })

    /* with failed request */
    describe("with failed request", () => {

      /* Mock enhancers */
      beforeEach(() => {
        mockWithFormSubmitWithError()
        mockWithForm()
      })

      /* Test: should render <Render /> */
      it("should render <Render />", async () => {
        const wrapper = mountPlaceholder()
        expect(wrapper.find(Placeholder).exists()).toBe(true)
      })
    })
  })
})
