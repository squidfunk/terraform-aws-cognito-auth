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
  RememberMeActions,
  RememberMeActionTypes
} from "./actions"

/* ----------------------------------------------------------------------------
 * Types
 * ------------------------------------------------------------------------- */

/**
 * Remember me state
 *
 * The refresh state needs to be persisted across sessions to properly handle
 * token-based authentication as the refresh token is persisted as a secure
 * HTTP-only cookie, and thus cannot be read from the application.
 *
 * If `failed` is set to `false`, the application will authenticate during the
 * initial load in the background in order to refresh the session without
 * prompting for credentials again. If this fails, the application will set the
 * value to `true`, effectively disabling token-based authentication until the
 * next credential-based authentication.
 *
 * The `active` value determines the checked state of the remember me checkbox,
 * so the user doesn't have to re-check it everytime the refresh token expires
 * and he has to authenticate again.
 */
export interface RememberMeState {
  active: boolean                      /* Whether to remember the user */
  failed: boolean                      /* Whether token-based */
}

/* ----------------------------------------------------------------------------
 * Reducer
 * ------------------------------------------------------------------------- */

/**
 * Remember me reducer
 *
 * @param state - Remember me state
 * @param action - Remember me action
 */
export function remember(
  state: RememberMeState = { active: false, failed: true },
  action: RememberMeActions
): RememberMeState {
  switch (action.type) {
    case RememberMeActionTypes.SET:
      return { ...state, active: action.active }
    case RememberMeActionTypes.FAILED:
      return { ...state, failed: action.failed }
    default:
      return state
  }
}
