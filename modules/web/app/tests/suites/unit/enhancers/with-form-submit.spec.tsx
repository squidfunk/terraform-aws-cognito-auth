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

import { chance, Placeholder } from "_/helpers"
import { mockSession } from "_/mocks/common/session"
import { mockStore } from "_/mocks/providers"
import {
  mockAxiosPostWithError,
  mockAxiosPostWithResult
} from "_/mocks/vendor/axios"

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

    /* { form } */
    describe("{ form }", () => {

      /* Apply enhancer to placeholder component */
      const Component = withFormSubmit()(Placeholder)
      const component = mount(<Component />, {
        context: { store }
      })

      /* Form submission state */
      const form = component
        .find<WithFormSubmit>(Placeholder)
        .prop("form")

      /* Test: should initialize form submission state */
      it("should initialize form submission state", () => {
        expect(form).toEqual({ pending: false, success: false })
      })
    })

    /* { setForm } */
    describe("{ setForm }", () => {

      /* Apply enhancer to placeholder component */
      const Component = withFormSubmit()(Placeholder)
      const component = mount(<Component />, {
        context: { store }
      })

      /* Form submission state reducer */
      const setForm = component
        .find<WithFormSubmit>(Placeholder)
        .prop("setForm")

      /* Test: should update form submission state */
      it("should update form submission state", () => {
        setForm({ pending: true, success: false })
        component.update()
        expect(component.find<WithFormSubmit>(Placeholder).prop("form"))
          .toEqual({ pending: true, success: false })
      })
    })

    /* { submit } */
    describe("{ submit }", () => {

      /* Apply enhancer to placeholder component */
      const Component = withFormSubmit()(Placeholder)
      const component = mount(<Component />, {
        context: { store }
      })

      /* Submit form */
      const submit = component
        .find<WithFormSubmit>(Placeholder)
        .prop("submit")

      /* Test: should prepend API base path to current location */
      it("should prepend API base path to current location", async () => {
        const postMock = mockAxiosPostWithResult()
        await submit()
        expect(postMock).toHaveBeenCalledWith(
          jasmine.stringMatching(process.env.API_BASE_PATH!),
          jasmine.any(Object),
          jasmine.any(Object)
        )
      })

      /* Test: should send request to current location */
      it("should send request to current location", async () => {
        const postMock = mockAxiosPostWithResult()
        await submit()
        expect(postMock).toHaveBeenCalledWith(
          `/${process.env.API_BASE_PATH!}/`,
          jasmine.any(Object),
          jasmine.any(Object)
        )
      })

      /* Test: should send request with provided payload */
      it("should send request with provided payload", async () => {
        const data = { [chance.string()]: chance.string() }
        const postMock = mockAxiosPostWithResult()
        await submit(data)
        expect(postMock).toHaveBeenCalledWith(
          jasmine.any(String),
          data,
          jasmine.any(Object)
        )
      })

      /* Test: should send request with content-type header */
      it("should send request with content-type header", async () => {
        const postMock = mockAxiosPostWithResult()
        await submit()
        expect(postMock).toHaveBeenCalledWith(
          jasmine.any(String),
          jasmine.any(Object),
          jasmine.objectContaining({
            headers: {
              "Content-Type": "application/json"
            }
          })
        )
      })

      /* should send request with credentials */
      it("should send request with credentials", async () => {
        const postMock = mockAxiosPostWithResult()
        await submit()
        expect(postMock).toHaveBeenCalledWith(
          jasmine.any(String),
          jasmine.any(Object),
          jasmine.objectContaining({
            withCredentials: true
          })
        )
      })

      /* Test: should dismiss notification before sending request */
      it("should dismiss notification before sending request", async () => {
        mockAxiosPostWithResult()
        await submit()
        expect(store.getActions()).toMatchSnapshot()
      })

      /* with successful request */
      describe("with successful request", () => {

        /* Test: should set response */
        it("should set response", async () => {
          const data = { [chance.string()]: chance.string() }
          mockAxiosPostWithResult(data)
          await submit()
          component.update()
          expect(component.find<WithFormSubmit>(Placeholder).prop("form"))
            .toEqual(jasmine.objectContaining({
              response: data
            }))
        })

        /* Test: should enable success flag */
        it("should enable success flag", async () => {
          mockAxiosPostWithResult()
          await submit()
          component.update()
          expect(component.find<WithFormSubmit>(Placeholder).prop("form"))
            .toEqual(jasmine.objectContaining({
              pending: false,
              success: true
            }))
        })
      })

      /* with failed request */
      describe("with failed request", () => {

        /* Test: should set error */
        it("should set error", async () => {
          const errMock = new Error()
          mockAxiosPostWithError(errMock)
          await submit()
          component.update()
          expect(component.find<WithFormSubmit>(Placeholder).prop("form"))
            .toEqual(jasmine.objectContaining({
              err: errMock
            }))
        })

        /* Test: should disable success flag */
        it("should disable success flag", async () => {
          mockAxiosPostWithError()
          await submit()
          component.update()
          expect(component.find<WithFormSubmit>(Placeholder).prop("form"))
            .toEqual(jasmine.objectContaining({
              pending: false,
              success: false
            }))
        })

        /* Test: should display notification */
        it("should display notification", async () => {
          const errMock = new Error()
          mockAxiosPostWithError(errMock, "__MESSAGE__")
          await submit()
          expect(store.getActions()).toMatchSnapshot()
        })
      })
    })

    /* with target */
    describe("with target", () => {

      /* { submit } */
      describe("{ submit }", () => {

        /* Target URL */
        const target = chance.string()

        /* Apply enhancer to placeholder component */
        const Component = withFormSubmit({ target })(Placeholder)
        const component = mount(<Component />, {
          context: { store }
        })

        /* Submit form */
        const submit = component
          .find<WithFormSubmit>(Placeholder)
          .prop("submit")

        /* Test: should prepend API base path to provided target URL */
        it("should prepend API base path to provided target URL", async () => {
          const postMock = mockAxiosPostWithResult()
          await submit()
          expect(postMock).toHaveBeenCalledWith(
            jasmine.stringMatching(process.env.API_BASE_PATH!),
            jasmine.any(Object),
            jasmine.any(Object)
          )
        })

        /* Test: should send request to provided target URL */
        it("should send request to provided target URL", async () => {
          const postMock = mockAxiosPostWithResult()
          await submit()
          expect(postMock).toHaveBeenCalledWith(
            `/${process.env.API_BASE_PATH!}/${target}`,
            jasmine.any(Object),
            jasmine.any(Object)
          )
        })
      })
    })

    /* with message */
    describe("with message", () => {

      /* { submit } */
      describe("{ submit }", () => {

        /* Message rendered on success */
        const message = "__MESSAGE__"

        /* Apply enhancer to placeholder component */
        const Component = withFormSubmit({ message })(Placeholder)
        const component = mount(<Component />, {
          context: { store }
        })

        /* Submit form */
        const submit = component
          .find<WithFormSubmit>(Placeholder)
          .prop("submit")

        /* Test: should display notification */
        it("should display notification", async () => {
          mockAxiosPostWithResult()
          await submit()
          expect(store.getActions()).toMatchSnapshot()
        })
      })
    })

    /* with authorization */
    describe("with authorization", () => {

      /* Session */
      const session = mockSession()

      /* Apply enhancer to placeholder component */
      const Component = withFormSubmit({ authorize: true })(Placeholder)
      const component = mount(<Component />, {
        context: {
          store: mockStore({ session })
        }
      })

      /* Submit form */
      const submit = component
        .find<WithFormSubmit>(Placeholder)
        .prop("submit")

      /* Test: should send request with authorization header */
      it("should send request with authorization header", async () => {
        const postMock = mockAxiosPostWithResult()
        await submit()
        expect(postMock).toHaveBeenCalledWith(
          jasmine.any(String),
          jasmine.any(Object),
          jasmine.objectContaining({
            headers: jasmine.objectContaining({
              Authorization: "Bearer __TOKEN__"
            })
          })
        )
      })
    })
  })
})
