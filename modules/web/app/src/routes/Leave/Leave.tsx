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

import * as React from "react"
import {
  branch,
  compose,
  lifecycle,
  pure,
  renderComponent,
  setDisplayName
} from "recompose"

import { LeaveRequest } from "common"
import { Loading } from "components"
import {
  WithFormSubmit,
  withFormSubmit,
  withRememberMe,
  WithRememberMeDispatch,
  WithSession,
  withSession
} from "enhancers"

import { LeaveSuccess } from "./LeaveSuccess"

/* ----------------------------------------------------------------------------
 * Types
 * ------------------------------------------------------------------------- */

/**
 * Lifecycle properties
 */
type LifecycleProps =
  & WithSession
  & WithRememberMeDispatch
  & WithFormSubmit<LeaveRequest>

/**
 * Branch properties
 */
type BranchProps =
  & WithFormSubmit<LeaveRequest>

/* ----------------------------------------------------------------------------
 * Presentational component
 * ------------------------------------------------------------------------- */

/**
 * Render component
 *
 * @return JSX element
 */
export const Render: React.SFC =
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
  return compose(
    withSession(),
    withRememberMe(),
    withFormSubmit<LeaveRequest>({
      message: "You signed out of your account",
      authorize: true
    }),
    lifecycle<LifecycleProps, {}>({
      componentWillMount() {
        const { setRememberMeResult } = this.props
        setRememberMeResult(false) // avoid re-authentication
      },
      async componentDidMount() {
        const { submit, terminateSession } = this.props
        await submit()
        terminateSession()
      }
    }),
    branch<BranchProps>(
      ({ form }) => Boolean(form.success || form.err),
      renderComponent(LeaveSuccess)
    ),
    pure,
    setDisplayName("Leave")
  )
}

/**
 * Sign out component
 */
export const Leave = enhance()(Render)
