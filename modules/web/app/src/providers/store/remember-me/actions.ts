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

import { Action } from "redux"

/* ----------------------------------------------------------------------------
 * Types
 * ------------------------------------------------------------------------- */

/**
 * Remember me action types
 */
export enum RememberMeActionTypes {
  SET = "REMEMBER_ME_SET",
  SET_FAILED = "REMEMBER_ME_SET_FAILED"
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
 * Remember me set failed action
 */
interface RememberMeSetFailedAction extends Action {
  type: RememberMeActionTypes.SET_FAILED
}

/* ------------------------------------------------------------------------- */

/**
 * Remember me actions
 */
export type RememberMeActions =
  | RememberMeSetAction
  | RememberMeSetFailedAction

/* ----------------------------------------------------------------------------
 * Actions
 * ------------------------------------------------------------------------- */

/**
 * Set remember me flag action creator
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
 * Set remember me failed action creator
 *
 * @return Action
 */
export const setRememberMeFailedAction =
  (): RememberMeSetFailedAction => ({
    type: RememberMeActionTypes.SET_FAILED
  })
