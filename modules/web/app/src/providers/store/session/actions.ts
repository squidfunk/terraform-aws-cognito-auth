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

import { Session } from "common"

/* ----------------------------------------------------------------------------
 * Types
 * ------------------------------------------------------------------------- */

/**
 * Session action types
 */
export enum SessionActionTypes {
  INIT = "SESSION_INIT",
  TERMINATE = "SESSION_TERMINATE"
}

/* ------------------------------------------------------------------------- */

/**
 * Session init action
 */
interface SessionInitAction extends Action {
  type: SessionActionTypes.INIT
  session: Session<string>
}

/**
 * Session terminate action
 */
interface SessionTerminateAction extends Action {
  type: SessionActionTypes.TERMINATE
}

/* ------------------------------------------------------------------------- */

/**
 * Session actions
 */
export type SessionActions =
  | SessionInitAction
  | SessionTerminateAction

/* ----------------------------------------------------------------------------
 * Actions
 * ------------------------------------------------------------------------- */

/**
 * Initialize session action creator
 *
 * @param session - Session
 *
 * @return Action
 */
export const initSessionAction =
  (session: Session<string>): SessionInitAction => ({
    type: SessionActionTypes.INIT, session
  })

/**
 * Terminate session action creator
 *
 * @return Action
 */
export const terminateSessionAction =
  (): SessionTerminateAction => ({
    type: SessionActionTypes.TERMINATE
  })
