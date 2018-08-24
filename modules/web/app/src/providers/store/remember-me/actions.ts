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

import { Action } from "redux"

/* ----------------------------------------------------------------------------
 * Types
 * ------------------------------------------------------------------------- */

/**
 * Remember me action types
 */
export enum RememberMeActionTypes {
  SET = "REMEMBER_ME_SET",
  FAILED = "REMEMBER_ME_FAILED"
}

/* ------------------------------------------------------------------------- */

/**
 * Remember me set action
 */
interface RememberMeSetAction extends Action {
  type: RememberMeActionTypes.SET
  active: boolean
}

/**
 * Remember me failed action
 */
interface RememberMeFailedAction extends Action {
  type: RememberMeActionTypes.FAILED
  failed: boolean
}

/* ------------------------------------------------------------------------- */

/**
 * Remember me actions
 */
export type RememberMeActions =
  | RememberMeSetAction
  | RememberMeFailedAction

/* ----------------------------------------------------------------------------
 * Actions
 * ------------------------------------------------------------------------- */

/**
 * Remember me set action
 *
 * @param active - Whether to remember the user
 *
 * @return Action
 */
export const setRememberMeAction =
  (active: boolean): RememberMeSetAction => ({
    type: RememberMeActionTypes.SET, active
  })

/**
 * Remember me failed action
 *
 * @return Action
 */
export const failedRememberMeAction =
  (failed: boolean): RememberMeFailedAction => ({
    type: RememberMeActionTypes.FAILED, failed
  })
