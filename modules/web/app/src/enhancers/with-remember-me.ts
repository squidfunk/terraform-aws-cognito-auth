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

import { connect } from "react-redux"
import { Dispatch } from "redux"

import { State } from "providers/store"
import {
  RememberMeActions,
  RememberMeState,
  setRememberMeAction,
  setRememberMeResultAction
} from "providers/store/remember-me"

/* ----------------------------------------------------------------------------
 * Types
 * ------------------------------------------------------------------------- */

/**
 * Remember me state properties
 */
export interface WithRememberMeState {
  remember: RememberMeState            /* Remember me state */
}

/**
 * Remember me dispatcher properties
 */
export interface WithRememberMeDispatch {
  setRememberMe(active: boolean): void /* Set whether to remember the user */
  setRememberMeResult(
    result: boolean
  ): void                              /* Set authentication result */
}

/**
 * Remember me properties
 */
export type WithRememberMe =
  & WithRememberMeState
  & WithRememberMeDispatch

/* ----------------------------------------------------------------------------
 * Enhancer
 * ------------------------------------------------------------------------- */

/**
 * Enhance component with remember me state and dispatch
 *
 * @return Component enhancer
 */
export const withRememberMe = () =>
  connect<WithRememberMeState, WithRememberMeDispatch, {}, State>(
    ({ remember }: State) => ({ remember }),
    (dispatch: Dispatch<RememberMeActions>) => ({
      setRememberMe: active => dispatch(setRememberMeAction(active)),
      setRememberMeResult: result => dispatch(setRememberMeResultAction(result))
    })
  )
