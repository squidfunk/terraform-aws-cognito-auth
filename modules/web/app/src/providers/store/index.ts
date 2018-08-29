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

import { pick } from "ramda"
import { combineReducers, createStore } from "redux"

import {
  notification,
  NotificationState
} from "./notification/reducers"
import {
  remember,
  RememberMeState
} from "./remember-me/reducers"
import {
  session,
  SessionState
} from "./session/reducers"

/* ----------------------------------------------------------------------------
 * Types
 * ------------------------------------------------------------------------- */

/**
 * Redux store state
 */
export interface State {
  notification: NotificationState
  remember: RememberMeState
  session: SessionState
}

/* ----------------------------------------------------------------------------
 * Functions
 * ------------------------------------------------------------------------- */

/**
 * Persist the store state in local storage
 *
 * @param state - Redux store state
 */
export function dehydrate(state: State) {
  localStorage.setItem("state", JSON.stringify({
    remember: pick(["active"], state.remember),
    session: state.session
      ? pick(["id", "access"], state.session)
      : null
  }))
}

/**
 * Retrieve the store state from local storage
 *
 * @return Redux store state
 */
export function rehydrate(): State {
  return JSON.parse(localStorage.getItem("state") || "{}")
}

/* ----------------------------------------------------------------------------
 * Data
 * ------------------------------------------------------------------------- */

/**
 * Redux store reducers
 */
export const reducers = combineReducers<State>({
  notification,
  remember,
  session
})

/**
 * Redux store
 */
export const store = createStore(reducers, rehydrate())
store.subscribe(() => dehydrate(store.getState()))
