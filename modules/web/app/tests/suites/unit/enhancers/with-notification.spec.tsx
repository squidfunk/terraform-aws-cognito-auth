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

import { shallow } from "enzyme"
import { prop } from "ramda"
import * as React from "react"

import {
  withNotification,
  WithNotification
} from "enhancers"

import { placeholder } from "_/helpers"
import {
  mockDismissNotificationAction,
  mockDisplayNotificationAction,
  mockNotificationDataWithError,
  mockNotificationDataWithSuccess,
  mockStore
} from "_/mocks/providers"

/* ----------------------------------------------------------------------------
 * Tests
 * ------------------------------------------------------------------------- */

/* Notification enhancer */
describe("enhancers/with-notification", () => {

  /* Initialize store */
  const store = mockStore({
    notification: { show: false }
  })

  /* Clear store */
  beforeEach(() => {
    store.clearActions()
  })

  /* withNotification */
  describe("withNotification", () => {

    /* Apply enhancer to placeholder component */
    const Placeholder = placeholder<WithNotification>()
    const Component = withNotification()(Placeholder)
    const wrapper = shallow<WithNotification>(<Component />, {
      context: { store }
    })

    /* { notification } */
    describe("{ notification }", () => {

      /* Notification */
      const notification = wrapper.prop("notification")

      /* Test: should map state to props */
      it("should map state to props", () => {
        expect(prop("notification", store.getState())).toBe(notification)
      })
    })

    /* { displayNotification } */
    describe("{ displayNotification }", () => {

      /* Display notification dispatcher */
      const displayNotification = wrapper.prop("displayNotification")

      /* Test: should map dispatch to props */
      it("should map dispatch to props", () => {
        expect(displayNotification).toEqual(jasmine.any(Function))
      })

      /* Test: should dispatch action */
      it("should dispatch action", () => {
        mockDisplayNotificationAction()
        displayNotification(mockNotificationDataWithSuccess())
        expect(store.getActions().length).toEqual(1)
      })

      /* Test: should invoke action creator */
      it("should invoke action creator", () => {
        const displayNotificationActionMock = mockDisplayNotificationAction()
        const data = mockNotificationDataWithError()
        displayNotification(data)
        expect(displayNotificationActionMock)
          .toHaveBeenCalledWith(data)
      })
    })

    /* { dismissNotification } */
    describe("{ dismissNotification }", () => {

      /* Dismiss notification dispatcher */
      const dismissNotification = wrapper.prop("dismissNotification")

      /* Test: should map dispatch to props */
      it("should map dispatch to props", () => {
        expect(dismissNotification).toEqual(jasmine.any(Function))
      })

      /* Test: should dispatch action */
      it("should dispatch action", () => {
        mockDismissNotificationAction()
        dismissNotification()
        expect(store.getActions().length).toEqual(1)
      })

      /* Test: should invoke action creator */
      it("should invoke action creator", () => {
        const dismissNotificationActionMock = mockDismissNotificationAction()
        dismissNotification()
        expect(dismissNotificationActionMock)
          .toHaveBeenCalledWith()
      })
    })
  })
})
