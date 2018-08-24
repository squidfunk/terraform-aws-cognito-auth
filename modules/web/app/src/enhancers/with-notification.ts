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

import { connect } from "react-redux"
import { Dispatch } from "redux"

import { State } from "providers/store"
import {
  dismissNotificationAction,
  displayNotificationAction,
  NotificationActions,
  NotificationData,
  NotificationState
} from "providers/store/notification"

/* ----------------------------------------------------------------------------
 * Types
 * ------------------------------------------------------------------------- */

/**
 * Notification state properties
 */
export interface WithNotificationState {
  notification: NotificationState      /* Notification state */
}

/**
 * Notification dispatcher properties
 */
export interface WithNotificationDispatch {
  displayNotification(data: NotificationData): void
  dismissNotification(): void
}

/**
 * Notification properties
 */
export type WithNotification =
  & WithNotificationState
  & WithNotificationDispatch

/* ----------------------------------------------------------------------------
 * Enhancer
 * ------------------------------------------------------------------------- */

/**
 * Enhance component with notification state and dispatch
 *
 * @return Component enhancer
 */
export const withNotification = () =>
  connect<WithNotificationState, WithNotificationDispatch, {}, State>(
    ({ notification }: State) => ({ notification }),
    (dispatch: Dispatch<NotificationActions>) => ({
      displayNotification: data => dispatch(displayNotificationAction(data)),
      dismissNotification: () => dispatch(dismissNotificationAction())
    })
  )
