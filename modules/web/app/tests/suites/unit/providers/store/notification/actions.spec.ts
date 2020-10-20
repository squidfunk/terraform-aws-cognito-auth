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

import {
  NotificationActionTypes,
  dismissNotificationAction,
  displayNotificationAction
} from "providers/store/notification"

import {
  mockNotificationDataWithError,
  mockNotificationDataWithSuccess,
  mockStore
} from "_/mocks/providers"

/* ----------------------------------------------------------------------------
 * Tests
 * ------------------------------------------------------------------------- */

/* Notification actions */
describe("providers/store/notification", () => {

  /* Initialize store */
  const store = mockStore()

  /* Clear store */
  beforeEach(() => {
    store.clearActions()
  })

  /* displayNotificationAction */
  describe("displayNotificationAction", () => {

    /* Test: should create a notification to indicate success */
    it("should create a notification to indicate success", () => {
      const data = mockNotificationDataWithSuccess()
      store.dispatch(displayNotificationAction(data))
      expect(store.getActions().pop()).toEqual({
        type: NotificationActionTypes.DISPLAY,
        data
      })
    })

    /* Test: should create a notification to indicate an error */
    it("should create a notification to indicate an error", () => {
      const data = mockNotificationDataWithError()
      store.dispatch(displayNotificationAction(data))
      expect(store.getActions().pop()).toEqual({
        type: NotificationActionTypes.DISPLAY,
        data
      })
    })
  })

  /* dismissNotificationAction */
  describe("dismissNotificationAction", () => {

    /* Test: should dismiss all notifications */
    it("should dismiss all notifications", () => {
      store.dispatch(dismissNotificationAction())
      expect(store.getActions().pop()).toEqual({
        type: NotificationActionTypes.DISMISS
      })
    })
  })
})
