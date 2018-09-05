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

import { chance } from "_/helpers"
import { Placeholder } from "_/mocks/components"
import {
  mockWithFormSubmit,
  mockWithNotification,
  mockWithSession
} from "_/mocks/enhancers"
import {
  mockChangeEventForCheckboxInput,
  mockChangeEventForTextInput,
  mockSubmitEvent
} from "_/mocks/vendor/browser/events"

/* ----------------------------------------------------------------------------
 * Tests
 * ------------------------------------------------------------------------- */

/* Form enhancer */
describe("enhancers/with-form", () => {

  /* Mount placeholder wrapped with enhancer */
  function mountPlaceholder(
    options: WithFormOptions
  ) {
    const Component = withForm(options)(Placeholder)
    return mount<WithForm>(<Component />)
  }

  /* withForm */
  describe("withForm", () => {

    /* Initial form state */
    const initial = { [chance.string()]: chance.string() }

    /* Mock enhancers */
    beforeEach(() => {
      mockWithNotification()
      mockWithSession()
      mockWithFormSubmit()
    })

    /* { request } */
    describe("{ request }", () => {

      /* Test: should initialize form state */
      it("should initialize form state", () => {
        const wrapper = mountPlaceholder({ initial })
        expect(wrapper.find(Placeholder).prop("request"))
          .toEqual(initial)
      })
    })

    /* { setRequest } */
    describe("{ setRequest }", () => {

      /* Test: should update form state */
      it("should update form state", () => {
        const wrapper = mountPlaceholder({ initial })
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

      /* Test: should update form state for text input */
      it("should update form state for text input", () => {
        const wrapper = mountPlaceholder({ initial })
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
        const wrapper = mountPlaceholder({ initial })
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

      /* Test: should submit form */
      it("should submit form", () => {
        const wrapper = mountPlaceholder({ initial })
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
