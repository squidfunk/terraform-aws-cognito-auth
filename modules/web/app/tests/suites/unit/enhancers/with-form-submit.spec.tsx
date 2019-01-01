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

import { mount } from "enzyme"
import * as React from "react"

import {
  withFormSubmit,
  WithFormSubmitOptions
} from "enhancers"
import { NotificationType } from "providers/store/notification"

import { chance } from "_/helpers"
import { mockSession } from "_/mocks/common/session"
import { Placeholder } from "_/mocks/components"
import {
  mockWithNotification,
  mockWithSession
} from "_/mocks/enhancers"
import {
  mockAxiosError,
  mockAxiosPostWithError,
  mockAxiosPostWithResult
} from "_/mocks/vendor/axios"

/* ----------------------------------------------------------------------------
 * Tests
 * ------------------------------------------------------------------------- */

/* Form submission enhancer */
describe("enhancers/with-form-submit", () => {

  /* Mount placeholder wrapped with enhancer */
  function mountPlaceholder(
    options?: WithFormSubmitOptions
  ) {
    const Component = withFormSubmit(options)(Placeholder)
    return mount(<Component />)
  }

  /* withFormSubmit */
  describe("withFormSubmit", () => {

    /* { form } */
    describe("{ form }", () => {

      /* Mock enhancers */
      beforeEach(() => {
        mockWithNotification()
        mockWithSession()
      })

      /* Test: should initialize form submission state */
      it("should initialize form submission state", () => {
        const wrapper = mountPlaceholder()
        expect(wrapper.find(Placeholder).prop("form"))
          .toEqual({ pending: false, success: false })
      })
    })

    /* { setForm } */
    describe("{ setForm }", () => {

      /* Mock enhancers */
      beforeEach(() => {
        mockWithNotification()
        mockWithSession()
      })

      /* Test: should update form submission state */
      it("should update form submission state", () => {
        const wrapper = mountPlaceholder()
        const setForm = wrapper.find(Placeholder).prop("setForm")
        setForm({ pending: true, success: false })
        wrapper.update()
        expect(wrapper.find(Placeholder).prop("form"))
          .toEqual({ pending: true, success: false })
      })
    })

    /* { submit } */
    describe("{ submit }", () => {

      /* Mock enhancers */
      beforeEach(() => {
        mockWithNotification()
        mockWithSession()
      })

      /* Test: should prepend current location with API base path */
      it("should prepend current location with API base path", async () => {
        const wrapper = mountPlaceholder()
        const submit = wrapper.find(Placeholder).prop("submit")
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
        const wrapper = mountPlaceholder()
        const submit = wrapper.find(Placeholder).prop("submit")
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
        const wrapper = mountPlaceholder()
        const submit = wrapper.find(Placeholder).prop("submit")
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
        const wrapper = mountPlaceholder()
        const submit = wrapper.find(Placeholder).prop("submit")
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
        const wrapper = mountPlaceholder()
        const submit = wrapper.find(Placeholder).prop("submit")
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
        const wrapper = mountPlaceholder()
        const submit = wrapper.find(Placeholder).prop("submit")
        mockAxiosPostWithResult()
        await submit()
        expect(wrapper.find(Placeholder).prop("dismissNotification"))
          .toHaveBeenCalledWith()
      })

      /* with successful request */
      describe("with successful request", () => {

        /* Test: should set response */
        it("should set response", async () => {
          const wrapper = mountPlaceholder()
          const submit = wrapper.find(Placeholder).prop("submit")
          const data = { [chance.string()]: chance.string() }
          mockAxiosPostWithResult(data)
          await submit()
          wrapper.update()
          expect(wrapper.find(Placeholder).prop("form"))
            .toEqual(jasmine.objectContaining({
              response: data
            }))
        })

        /* Test: should enable success flag */
        it("should enable success flag", async () => {
          const wrapper = mountPlaceholder()
          const submit = wrapper.find(Placeholder).prop("submit")
          mockAxiosPostWithResult()
          await submit()
          wrapper.update()
          expect(wrapper.find(Placeholder).prop("form"))
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
          const wrapper = mountPlaceholder()
          const submit = wrapper.find(Placeholder).prop("submit")
          const errMock = mockAxiosError()
          mockAxiosPostWithError(errMock)
          await submit()
          wrapper.update()
          expect(wrapper.find(Placeholder).prop("form"))
            .toEqual(jasmine.objectContaining({
              err: errMock
            }))
        })

        /* Test: should disable success flag */
        it("should disable success flag", async () => {
          const wrapper = mountPlaceholder()
          const submit = wrapper.find(Placeholder).prop("submit")
          mockAxiosPostWithError()
          await submit()
          wrapper.update()
          expect(wrapper.find(Placeholder).prop("form"))
            .toEqual(jasmine.objectContaining({
              pending: false,
              success: false
            }))
        })

        /* Test: should display notification */
        it("should display notification", async () => {
          const wrapper = mountPlaceholder()
          const submit = wrapper.find(Placeholder).prop("submit")
          const errMock = mockAxiosError(chance.string())
          mockAxiosPostWithError(errMock)
          await submit()
          expect(wrapper.find(Placeholder).prop("displayNotification"))
            .toHaveBeenCalledWith({
              type: NotificationType.ERROR,
              message: errMock.response!.data.message
            })
        })
      })
    })

    /* with target */
    describe("with target", () => {

      /* Mock enhancers */
      beforeEach(() => {
        mockWithNotification()
        mockWithSession()
      })

      /* { submit } */
      describe("{ submit }", () => {

        /* Target URL */
        const target = chance.string()

        /* Test: should prepend provided target URL with API base path */
        it("should prepend provided target URL with API base path",
          async () => {
            const wrapper = mountPlaceholder({ target })
            const submit = wrapper.find(Placeholder).prop("submit")
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
          const wrapper = mountPlaceholder({ target })
          const submit = wrapper.find(Placeholder).prop("submit")
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

      /* Mock enhancers */
      beforeEach(() => {
        mockWithNotification()
        mockWithSession()
      })

      /* { submit } */
      describe("{ submit }", () => {

        /* Message rendered on success */
        const message = chance.string()

        /* Test: should display notification */
        it("should display notification", async () => {
          const wrapper = mountPlaceholder({ message })
          const submit = wrapper.find(Placeholder).prop("submit")
          mockAxiosPostWithResult()
          await submit()
          expect(wrapper.find(Placeholder).prop("displayNotification"))
            .toHaveBeenCalledWith({
              type: NotificationType.SUCCESS,
              message
            })
        })
      })
    })

    /* with authorization */
    describe("with authorization", () => {

      /* Session */
      const session = mockSession()

      /* Mock enhancers */
      beforeEach(() => {
        mockWithNotification()
        mockWithSession(session)
      })

      /* Test: should send request with authorization header */
      it("should send request with authorization header", async () => {
        const wrapper = mountPlaceholder({ authorize: true })
        const submit = wrapper.find(Placeholder).prop("submit")
        const postMock = mockAxiosPostWithResult()
        await submit()
        expect(postMock).toHaveBeenCalledWith(
          jasmine.any(String),
          jasmine.any(Object),
          jasmine.objectContaining({
            headers: jasmine.objectContaining({
              Authorization: `Bearer ${session.access.token}`
            })
          })
        )
      })
    })
  })
})
