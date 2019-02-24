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

import {
  branch,
  compose,
  pure,
  renderComponent,
  setDisplayName
} from "recompose"

import {
  withRememberMe,
  WithRememberMe
} from "enhancers"

import { AuthenticateWithCredentials } from "./AuthenticateWithCredentials"
import { AuthenticateWithToken } from "./AuthenticateWithToken"

/* ----------------------------------------------------------------------------
 * Types
 * ------------------------------------------------------------------------- */

/**
 * Branch properties
 */
type BranchProps =
  & WithRememberMe

/* ------------------------------------------------------------------------- */

/**
 * Render properties
 */
export type RenderProps =
  & WithRememberMe

/* ----------------------------------------------------------------------------
 * Presentational component
 * ------------------------------------------------------------------------- */

/**
 * Render component
 *
 * @param props - Properties
 *
 * @return JSX element
 */
export const Render = AuthenticateWithCredentials

/* ----------------------------------------------------------------------------
 * Enhanced component
 * ------------------------------------------------------------------------- */

/**
 * Enhance component
 *
 * @return Component enhancer
 */
export function enhance() {
  return compose<RenderProps, {}>(
    withRememberMe(),
    branch<BranchProps>(
      ({ remember: { active, failed } }) => active && !failed,
      renderComponent(AuthenticateWithToken)
    ),
    pure,
    setDisplayName("Authenticate")
  )
}

/**
 * Authentication component
 */
export const Authenticate = enhance()(Render)
