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

import { Session } from "common"

import {
  SessionActions,
  SessionActionTypes
} from "./actions"

/* ----------------------------------------------------------------------------
 * Types
 * ------------------------------------------------------------------------- */

/**
 * Session data
 *
 * The `renewed` flag describes whether the session successfully renewd after
 * a successful login attempt. This is necessary, so we know when the session
 * was actually persisted to local storage.
 */
export interface SessionData extends Session<string> {
  renewed?: boolean                    /* Whether the session was renewed */
}

/**
 * Session state
 */
export type SessionState = SessionData | null

/* ----------------------------------------------------------------------------
 * Reducer
 * ------------------------------------------------------------------------- */

/**
 * Session reducer
 *
 * @param state - Session state
 * @param action - Session action
 */
export function session(
  state: SessionState = null,
  action: SessionActions
): SessionState {
  switch (action.type) {
    case SessionActionTypes.INIT:
      const { id, access } = action.session
      return { id, access, renewed: true }
    case SessionActionTypes.TERMINATE:
      return null
    default:
      return state
  }
}
