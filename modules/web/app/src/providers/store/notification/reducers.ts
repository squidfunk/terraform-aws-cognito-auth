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
  NotificationActions,
  NotificationActionTypes
} from "./actions"

/* ----------------------------------------------------------------------------
 * Types
 * ------------------------------------------------------------------------- */

/**
 * Notification type
 */
export enum NotificationType {
  SUCCESS = "SUCCESS",                 /* Operation successful */
  ERROR = "ERROR"                      /* Operation errored */
}

/**
 * Notification data
 */
export interface NotificationData {
  type: NotificationType               /* Notification type */
  message: string                      /* Notification message */
}

/**
 * Notification state
 */
export interface NotificationState {
  data?: NotificationData              /* Notification data */
  show: boolean                        /* Notification visibility */
}

/* ----------------------------------------------------------------------------
 * Reducer
 * ------------------------------------------------------------------------- */

/**
 * Notification reducer
 *
 * @param state - Notification state
 * @param action - Notification action
 */
export function notification(
  state: NotificationState = { show: false },
  action: NotificationActions
): NotificationState {
  switch (action.type) {
    case NotificationActionTypes.DISPLAY:
      return { data: action.data, show: true }
    case NotificationActionTypes.DISMISS:
      return { ...state, show: false }
    default:
      return state
  }
}
