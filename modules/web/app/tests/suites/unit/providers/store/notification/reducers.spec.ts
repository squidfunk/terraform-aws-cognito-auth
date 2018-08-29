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

import {
  dismissNotificationAction,
  displayNotificationAction,
  notification,
  NotificationData,
  NotificationType,
} from "providers/store/notification"

import { chance } from "_/helpers"
import { mockAction } from "_/mocks/providers"

/* ----------------------------------------------------------------------------
 * Tests
 * ------------------------------------------------------------------------- */

/* Notification reducers */
describe("providers/store/notification", () => {

  /* Notification reducer */
  describe("notification", () => {

    /* Test: should initialize state */
    it("should initialize state", () => {
      const action = mockAction()
      expect(notification(undefined, action as any))
        .toEqual({ show: false })
    })

    /* with NOTIFICATION_DISPLAY */
    describe("with NOTIFICATION_DISPLAY", () => {

      /* Notification data */
      const data: NotificationData = {
        type: NotificationType.SUCCESS,
        message: chance.string()
      }

      /* Test: should create a notification */
      it("should create a notification", () => {
        const action = displayNotificationAction(data)
        expect(notification(undefined, action))
          .toEqual(jasmine.objectContaining({ data }))
      })

      /* Test: should show notification */
      it("should show notification", () => {
        const action = displayNotificationAction(data)
        expect(notification({ show: false }, action))
          .toEqual(jasmine.objectContaining({ show: true }))
      })
    })

    /* with NOTIFICATION_DISMISS */
    describe("with NOTIFICATION_DISMISS", () => {

      /* Notification data */
      const data: NotificationData = {
        type: NotificationType.ERROR,
        message: chance.string()
      }

      /* Test: should hide notification */
      it("should hide notification", () => {
        const action = dismissNotificationAction()
        expect(notification({ show: true }, action))
          .toEqual(jasmine.objectContaining({ show: false }))
      })

      /* Test: should preserve notification data */
      it("should preserve notification data", () => {
        const action = dismissNotificationAction()
        expect(notification({ data, show: true }, action))
          .toEqual({ data, show: false })
      })
    })
  })
})
