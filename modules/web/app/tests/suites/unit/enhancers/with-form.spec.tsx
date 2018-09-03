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

import { mount } from "enzyme"
import * as React from "react"

import {
  withForm,
  WithForm,
  WithFormOptions
} from "enhancers"

import { chance, placeholder } from "_/helpers"
import { mockWithFormSubmit } from "_/mocks/enhancers"
import {
  mockChangeEventForCheckboxInput,
  mockChangeEventForTextInput,
  mockSubmitEvent
} from "_/mocks/vendor/browser/events"

/* ----------------------------------------------------------------------------
 * Helpers
 * ------------------------------------------------------------------------- */

/**
 * Wrap placeholder component with form enhancer
 *
 * @param options - Form options
 *
 * @return Stateless component
 */
function wrapWithForm(options: WithFormOptions) {
  const Placeholder = placeholder<WithForm>()
  const Component = withForm(options)(Placeholder)
  const wrapper = mount(<Component />)
  return {
    Placeholder,
    Component,
    wrapper
  }
}

/* ----------------------------------------------------------------------------
 * Tests
 * ------------------------------------------------------------------------- */

/* Form enhancer */
describe("enhancers/with-form", () => {

  /* withForm */
  describe("withForm", () => {

    /* Initial form state */
    const initial = { [chance.string()]: chance.string() }

    /* { request } */
    describe("{ request }", () => {

      /* Mock enhancers */
      beforeEach(() => {
        mockWithFormSubmit()
      })

      /* Test: should initialize form state */
      it("should initialize form state", () => {
        const { wrapper, Placeholder } = wrapWithForm({ initial })
        const request = wrapper.find(Placeholder).prop("request")
        expect(request).toEqual(initial)
      })
    })

    /* { setRequest } */
    describe("{ setRequest }", () => {

      /* Mock enhancers */
      beforeEach(() => {
        mockWithFormSubmit()
      })

      /* Test: should update form state */
      it("should update form state", () => {
        const { wrapper, Placeholder } = wrapWithForm({ initial })
        const setRequest = wrapper.find(Placeholder).prop("setRequest")
        const request = { [chance.string()]: chance.string() }
        setRequest(request)
        wrapper.update()
        expect(wrapper.find(Placeholder).prop("request"))
          .toEqual(request)
      })
    })

    /* { handleChange } */
    describe("{ handleChange }", () => {

      /* Mock enhancers */
      beforeEach(() => {
        mockWithFormSubmit()
      })

      /* Test: should update form state for text input */
      it("should update form state for text input", () => {
        const { wrapper, Placeholder } = wrapWithForm({ initial })
        const handleChange = wrapper.find(Placeholder).prop("handleChange")
        const options = { name: chance.string(), value: chance.string() }
        handleChange(mockChangeEventForTextInput(options))
        wrapper.update()
        expect(wrapper.find(Placeholder).prop("request"))
          .toEqual(jasmine.objectContaining({
            ...initial, [options.name]: options.value
          }))
      })

      /* Test: should update form state for checkbox input */
      it("should update form state for checkbox input", () => {
        const { wrapper, Placeholder } = wrapWithForm({ initial })
        const handleChange = wrapper.find(Placeholder).prop("handleChange")
        const options = { name: chance.string(), checked: chance.bool() }
        handleChange(mockChangeEventForCheckboxInput(options))
        wrapper.update()
        expect(wrapper.find(Placeholder).prop("request"))
          .toEqual(jasmine.objectContaining({
            ...initial, [options.name]: options.checked
          }))
      })
    })

    /* { handleSubmit } */
    describe("{ handleSubmit }", () => {

      /* Mock enhancers */
      beforeEach(() => {
        mockWithFormSubmit()
      })

      /* Test: should submit form */
      it("should submit form", () => {
        const { wrapper, Placeholder } = wrapWithForm({ initial })
        const handleSubmit = wrapper.find(Placeholder).prop("handleSubmit")
        const ev = mockSubmitEvent()
        handleSubmit(ev)
        expect(ev.preventDefault).toHaveBeenCalledWith()
        expect(wrapper.find(Placeholder).prop("submit"))
          .toHaveBeenCalledWith(wrapper.find(Placeholder).prop("request"))
      })
    })
  })
})
