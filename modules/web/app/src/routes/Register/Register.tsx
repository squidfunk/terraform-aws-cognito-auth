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

import {
  Typography,
  withStyles,
  WithStyles
} from "@material-ui/core"
import * as React from "react"
import {
  compose,
  pure,
  setDisplayName
} from "recompose"

import { RegisterRequest } from "common"
import {
  Dialog,
  Form,
  FormButton,
  FormInput,
  FormPassword,
  Header,
  Notification,
  TextLink
} from "components"
import {
  WithForm,
  withForm
} from "enhancers"

import { Styles, styles } from "./Register.styles"

/* ----------------------------------------------------------------------------
 * Types
 * ------------------------------------------------------------------------- */

/**
 * Render properties
 */
export type RenderProps =
  & WithStyles<Styles>
  & WithForm<RegisterRequest>

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
        secondary="Register for a new account"
      />
      <Notification />
      <Form onSubmit={handleSubmit}>
        <FormInput
          name="email" label="Email address" required disabled={form.success}
          value={request.email} InputProps={{ readOnly: form.pending }}
          onChange={handleChange} autoComplete="email"
        />
        <FormPassword
          name="password" label="Password" required disabled={form.success}
          value={request.password} InputProps={{ readOnly: form.pending }}
          onChange={handleChange} autoComplete="new-password"
        />
        <FormButton
          className={classes.button} disabled={form.pending || form.success}
        >
          Register
        </FormButton>
        <Typography className={classes.authenticate}>
          Already have an account? <TextLink to="/">Sign in</TextLink>
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
  return compose<RenderProps, {}>(
    withStyles(styles),
    withForm<RegisterRequest>({
      message: "We just sent a verification link to your email address. " +
               "Please click on the link to complete your registration",
      initial: {
        email: "",
        password: ""
      }
    }),
    pure,
    setDisplayName("Register")
  )
}

/**
 * Registration component
 */
export const Register = enhance()(Render)
