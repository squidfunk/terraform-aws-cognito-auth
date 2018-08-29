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
  withFormSubmit,
  WithFormSubmit
} from "enhancers"

import { Placeholder } from "_/helpers"
import { mockStore } from "_/mocks/providers"

/* ----------------------------------------------------------------------------
 * Tests
 * ------------------------------------------------------------------------- */

/* Form submission enhancer */
describe("enhancers/with-form-submit", () => {

  /* Initialize store */
  const store = mockStore()

  /* Clear store */
  beforeEach(() => {
    store.clearActions()
  })

  /* withFormSubmit */
  describe("withFormSubmit", () => {

    /* Apply enhancer to placeholder component */
    const Component = withFormSubmit({})(Placeholder)
    const component = mount(<Component />, {
      context: { store }
    })

    /* { form } */
    describe("{ form }", () => {

      /* Form state */
      const form = component
        .find<WithFormSubmit>(Placeholder)
        .prop("form")

      /* Test: should initialize form state */
      it("should initialize form state", () => {
        expect(form).toEqual({ pending: false, success: false })
      })
    })

    /* { setForm } */
    describe("{ setForm }", () => {

      /* Form state reducer */
      const setForm = component
        .find<WithFormSubmit>(Placeholder)
        .prop("setForm")

      /* Test: should update form state */
      it("should update form state", () => {
        setForm({ pending: true, success: false })
        component.update()
        expect(component.find<WithFormSubmit>(Placeholder).prop("form"))
          .toEqual({ pending: true, success: false })
      })
    })
  })
})
