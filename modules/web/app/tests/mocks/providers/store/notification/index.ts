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

import * as _ from "providers/store/notification"

import { chance } from "_/helpers"

import { mockAction } from ".."

/* ----------------------------------------------------------------------------
 * Data
 * ------------------------------------------------------------------------- */

/**
 * Mock `NotificationData` with success
 *
 * @return Notification data
 */
export function mockNotificationDataWithSuccess(): _.NotificationData {
  return {
    type: _.NotificationType.SUCCESS,
    message: chance.string()
  }
}

/**
 * Mock `NotificationData` with error
 *
 * @return Notification data
 */
export function mockNotificationDataWithError(): _.NotificationData {
  return {
    type: _.NotificationType.ERROR,
    message: chance.string()
  }
}

/* ----------------------------------------------------------------------------
 * Functions
 * ------------------------------------------------------------------------- */

/**
 * Mock `displayNotificationAction`
 *
 * @return Jasmine spy
 */
export function mockDisplayNotificationAction(): jasmine.Spy {
  return spyOn(_, "displayNotificationAction")
    .and.returnValue(mockAction())
}

/**
 * Mock `dismissNotificationAction`
 *
 * @return Jasmine spy
 */
export function mockDismissNotificationAction(): jasmine.Spy {
  return spyOn(_, "dismissNotificationAction")
    .and.returnValue(mockAction())
}
