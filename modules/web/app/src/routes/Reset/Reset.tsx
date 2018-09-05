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

import { ResetRequest } from "common"
import {
  Dialog,
  Form,
  FormButton,
  FormInput,
  Header,
  Notification,
  TextLink
} from "components"
import {
  WithForm,
  withForm
} from "enhancers"

import { Styles, styles } from "./Reset.styles"

/* ----------------------------------------------------------------------------
 * Types
 * ------------------------------------------------------------------------- */

/**
 * Render properties
 */
export type RenderProps =
  & WithStyles<Styles>
  & WithForm<ResetRequest>

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
  ({ classes, form, request, handleChange, handleSubmit }) =>
    <Dialog>
      <Header
        primary={window.env.COGNITO_IDENTITY_POOL_NAME}
        secondary="Unlock your account"
      />
      <Notification />
      <Form onSubmit={handleSubmit}>
        <Typography>
          Enter your email address in the field below to reset your password.
          We will send you a verification link to complete the process.
        </Typography>
        <FormInput
          name="username" label="Email address" required disabled={form.success}
          value={request.username} InputProps={{ readOnly: form.pending }}
          onChange={handleChange} autoComplete="email"
        />
        <FormButton
          className={classes.button} disabled={form.pending || form.success}
        >
          Reset password
        </FormButton>
        <Typography className={classes.authenticate}>
          Remembered your password? <TextLink to="/">Sign in</TextLink>
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
    withForm<ResetRequest>({
      message: "We just sent a verification link to your email address. " +
               "Please click on the link to reset your password",
      initial: {
        username: ""
      }
    }),
    pure,
    setDisplayName("Reset")
  )
}

/**
 * Password reset component
 */
export const Reset = enhance()(Render)
