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
  WithForm
} from "enhancers"

import { chance, Placeholder } from "_/helpers"
import { mockStore } from "_/mocks/providers"
import { mockAxiosPostWithResult } from "_/mocks/vendor/axios"
import {
  mockCheckboxChangeEvent,
  mockSubmitEvent,
  mockTextChangeEvent
} from "_/mocks/vendor/dom/events"

/* ----------------------------------------------------------------------------
 * Tests
 * ------------------------------------------------------------------------- */

/* Form enhancer */
describe("enhancers/with-form", () => {

  /* Initialize store */
  const store = mockStore()

  /* Clear store */
  beforeEach(() => {
    store.clearActions()
  })

  /* withForm */
  describe("withForm", () => {

    /* Initial form state */
    const initial = { [chance.string()]: chance.string() }

    /* { request } */
    describe("{ request }", () => {

      /* Apply enhancer to placeholder component */
      const Component = withForm({ initial })(Placeholder)
      const component = mount(<Component />, {
        context: { store }
      })

      /* Form state */
      const request = component
        .find<WithForm>(Placeholder)
        .prop("request")

      /* Test: should initialize form state */
      it("should initialize form state", () => {
        expect(request).toEqual(initial)
      })
    })

    /* { setRequest } */
    describe("{ setRequest }", () => {

      /* Apply enhancer to placeholder component */
      const Component = withForm({ initial })(Placeholder)
      const component = mount(<Component />, {
        context: { store }
      })

      /* Form state reducer */
      const setRequest = component
        .find<WithForm>(Placeholder)
        .prop("setRequest")

      /* Test: should update form state */
      it("should update form state", () => {
        const request = { [chance.string()]: chance.string() }
        setRequest(request)
        component.update()
        expect(
          component
            .find<WithForm>(Placeholder)
            .prop("request")
        )
          .toEqual(request)
      })
    })

    /* { handleChange } */
    describe("{ handleChange }", () => {

      /* Apply enhancer to placeholder component */
      const Component = withForm({ initial })(Placeholder)
      const component = mount(<Component />, {
        context: { store }
      })

      /* Update form data handler */
      const handleChange = component
        .find<WithForm>(Placeholder)
        .prop("handleChange")

      /* Test: should update form state for text input */
      it("should update form state for text input", () => {
        const options = {
          name: chance.string(),
          value: chance.string()
        }
        handleChange(mockTextChangeEvent(options))
        component.update()
        expect(
          component
            .find<WithForm>(Placeholder)
            .prop("request")
        )
          .toEqual(jasmine.objectContaining({
            ...initial, [options.name]: options.value
          }))
      })

      /* Test: should update form state for checkbox input */
      it("should update form state for checkbox input", () => {
        const options = {
          name: chance.string(),
          checked: chance.bool()
        }
        handleChange(mockCheckboxChangeEvent(options))
        component.update()
        expect(
          component
            .find<WithForm>(Placeholder)
            .prop("request")
        )
          .toEqual(jasmine.objectContaining({
            ...initial, [options.name]: options.checked
          }))
      })
    })

    /* { handleSubmit } */
    describe("{ handleSubmit }", () => {

      /* Apply enhancer to placeholder component */
      const Component = withForm({ initial })(Placeholder)
      const component = mount(<Component />, {
        context: { store }
      })

      /* Submit form data handler */
      const handleSubmit = component
        .find<WithForm>(Placeholder)
        .prop("handleSubmit")

      /* Test: should submit form */
      it("should submit form", () => {
        const postMock = mockAxiosPostWithResult()
        const ev = mockSubmitEvent()
        handleSubmit(ev)
        expect(ev.preventDefault).toHaveBeenCalledWith()
        expect(postMock).toHaveBeenCalledWith(
          jasmine.any(String),
          initial,
          jasmine.any(Object)
        )
      })
    })
  })
})
