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

import * as React from "react"
import {
  branch,
  compose,
  lifecycle,
  pure,
  renderComponent,
  setDisplayName
} from "recompose"

import {
  AuthenticateRequestWithToken as AuthenticateRequest,
  Session
} from "common"
import { Loading } from "components"
import {
  withFormSubmit,
  WithFormSubmit,
  withNotification,
  WithNotificationDispatch,
  WithRememberMe
} from "enhancers"

import { AuthenticateSuccess } from "./AuthenticateSuccess"

/* ----------------------------------------------------------------------------
 * Types
 * ------------------------------------------------------------------------- */

/**
 * Authentication with refresh token properties
 */
export type AuthenticateWithTokenProps =
  & WithRememberMe

/* ------------------------------------------------------------------------- */

/**
 * Lifecycle properties
 */
type LifecycleProps =
  & AuthenticateWithTokenProps
  & WithNotificationDispatch
  & WithFormSubmit<AuthenticateRequest, Session<string>>

/**
 * Branch properties
 */
type BranchProps =
  & WithFormSubmit<AuthenticateRequest>

/* ----------------------------------------------------------------------------
 * Presentational component
 * ------------------------------------------------------------------------- */

/**
 * Render component
 *
 * @return JSX element
 */
export const Render: React.FunctionComponent =
  () => <Loading />

/* ----------------------------------------------------------------------------
 * Enhanced component
 * ------------------------------------------------------------------------- */

/**
 * Enhance component
 *
 * @return Component enhancer
 */
export function enhance() {
  return compose<{}, AuthenticateWithTokenProps>(
    withNotification(),
    withFormSubmit<AuthenticateRequest>({
      target: "/authenticate"
    }),
    lifecycle<LifecycleProps, {}>({
      async componentDidMount() {
        const { submit, dismissNotification } = this.props
        const { form, setRememberMeResult } = this.props
        await submit()
        dismissNotification()
        if (!form.success)
          setRememberMeResult(false)
      }
    }),
    branch<BranchProps>(
      ({ form }) => form.success && Boolean(form.response),
      renderComponent(AuthenticateSuccess)
    ),
    pure,
    setDisplayName("AuthenticateWithToken")
  )
}

/**
 * Authentication with refresh token component
 */
export const AuthenticateWithToken = enhance()(Render)
