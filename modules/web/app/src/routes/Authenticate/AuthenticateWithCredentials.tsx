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
  FormControlLabel,
  FormGroup,
  Typography,
  withStyles,
  WithStyles
} from "@material-ui/core"
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
  AuthenticateRequestWithCredentials as AuthenticateRequest,
  Session
} from "common"
import {
  Dialog,
  Form,
  FormButton,
  FormInput,
  FormPassword,
  FormRememberMe,
  Header,
  Notification,
  TextLink
} from "components"
import {
  WithForm,
  withForm,
  WithRememberMe
} from "enhancers"

import { AuthenticateSuccess } from "./AuthenticateSuccess"
import { Styles, styles } from "./AuthenticateWithCredentials.styles"

/* ----------------------------------------------------------------------------
 * Types
 * ------------------------------------------------------------------------- */

/**
 * Authentication with credentials properties
 */
export type AuthenticateWithCredentialsProps =
  & WithRememberMe

/* ------------------------------------------------------------------------- */

/**
 * Lifecycle properties
 */
type LifecycleProps =
  & AuthenticateWithCredentialsProps
  & WithForm<AuthenticateRequest, Session<string>>

/**
 * Branch properties
 */
type BranchProps =
  & WithForm<AuthenticateRequest, Session<string>>

/* ------------------------------------------------------------------------- */

/**
 * Render properties
 */
export type RenderProps =
  & WithStyles<Styles>
  & WithForm<AuthenticateRequest, Session<string>>

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
export const Render: React.FunctionComponent<RenderProps> =
  ({ classes, form, request, handleChange, handleSubmit }) =>
    <Dialog>
      <Header
        primary={window.env.COGNITO_IDENTITY_POOL_NAME}
        secondary="Sign in to your account"
      />
      <Notification />
      <Form onSubmit={handleSubmit}>
        <FormInput
          name="username" label="Email address" required disabled={form.success}
          value={request.username} InputProps={{ readOnly: form.pending }}
          onChange={handleChange} autoComplete="username"
        />
        <FormPassword
          name="password" label="Password" required disabled={form.success}
          value={request.password} InputProps={{ readOnly: form.pending }}
          onChange={handleChange} autoComplete="password"
        />
        <FormGroup row className={classes.controls}>
          <FormControlLabel label="Remember me" control={
            <FormRememberMe
              name="remember" checked={request.remember}
              onChange={handleChange}
            />
          } />
          <Typography className={classes.forgotPassword}>
            <TextLink to="/reset" tabIndex={-1}>
              Forgot password?
            </TextLink>
          </Typography>
        </FormGroup>
        <FormButton disabled={form.pending}>
          Sign in
        </FormButton>
        <Typography className={classes.register}>
          Don't have an account? <TextLink to="/register">
            Register
          </TextLink>
        </Typography>
      </Form>
    </Dialog>

/* ----------------------------------------------------------------------------
 * Enhanced component
 * ------------------------------------------------------------------------- */

/**
 * Enhance component
 *
 * @return Component enhancer
 */
export function enhance() {
  return compose<RenderProps, AuthenticateWithCredentialsProps>(
    withStyles(styles),
    withForm<AuthenticateRequest, Session<string>>({
      target: "/authenticate",
      initial: {
        username: "",
        password: "",
        remember: false
      }
    }),
    lifecycle<LifecycleProps, {}>({
      componentWillMount() {
        const { remember, setRememberMeFailed } = this.props
        const { request, setRequest } = this.props
        setRememberMeFailed()
        setRequest({
          ...request,
          remember: remember.active
        })
      }
    }),
    branch<BranchProps>(
      ({ form }) => form.success && Boolean(form.response),
      renderComponent(AuthenticateSuccess)
    ),
    pure,
    setDisplayName("AuthenticateWithCredentials")
  )
}

/**
 * Authentication with credentials component
 */
export const AuthenticateWithCredentials = enhance()(Render)
