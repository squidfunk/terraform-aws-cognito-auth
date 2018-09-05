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

import { parse } from "query-string"
import * as React from "react"
import {
  branch,
  compose,
  lifecycle,
  pure,
  renderComponent,
  setDisplayName,
  withProps
} from "recompose"

import {
  AuthenticateRequest,
  Session
} from "common"
import {
  ExternalRedirect,
  Loading
} from "components"
import {
  WithFormSubmit,
  WithRememberMe,
  withSession,
  WithSession
} from "enhancers"

/* ----------------------------------------------------------------------------
 * Types
 * ------------------------------------------------------------------------- */

/**
 * Authentication success properties
 */
export type AuthenticateSuccessProps =
  & WithRememberMe
  & WithFormSubmit<AuthenticateRequest, Session<string>>

/* ------------------------------------------------------------------------- */

/**
 * Inner properties
 */
interface InnerProps {
  path: string                         /* Redirect path */
}

/**
 * Lifecycle properties
 */
type LifecycleProps =
  & AuthenticateSuccessProps
  & WithSession

/**
 * Branch properties
 */
type BranchProps =
  & WithSession

/* ------------------------------------------------------------------------- */

/**
 * Render properties
 */
export type RenderProps =
  & WithSession
  & InnerProps

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
export const Render: React.SFC<RenderProps> =
  ({ path, session }) =>
    <ExternalRedirect href={
      `//${window.env.APP_ORIGIN}/${path}#${session!.id.token}`
    } />

/* ----------------------------------------------------------------------------
 * Enhanced component
 * ------------------------------------------------------------------------- */

/**
 * Enhance component
 *
 * @return Component enhancer
 */
export function enhance() {
  return compose<RenderProps, AuthenticateSuccessProps>(
    withSession(),
    withProps<InnerProps, RenderProps>(() => {
      const { redirect } = parse(location.search)
      return {
        path: redirect || ""
      }
    }),
    lifecycle<LifecycleProps, {}>({
      componentDidMount() {
        const { form, initSession, setRememberMeResult } = this.props
        if (form.response) {
          initSession(form.response)
          if (form.response.refresh)
            setRememberMeResult(true)
        }
      }
    }),
    branch<BranchProps>(
      ({ session }) => !(session && session.renewed),
      renderComponent(() => <Loading />)
    ),
    pure,
    setDisplayName("AuthenticateSuccess")
  )
}

/**
 * Authentication success component
 */
export const AuthenticateSuccess = enhance()(Render)
