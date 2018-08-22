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
  withProps
} from "recompose"

import { RegisterRequest } from "common"
import {
  Alert,
  Form,
  FormButton,
  FormInput,
  FormPassword,
  Header,
  TextLink
} from "components"
import {
  WithForm,
  withForm,
  WithFormProps
} from "enhancers"

import { Styles, styles } from "./Register.styles"

/* ----------------------------------------------------------------------------
 * Types
 * ------------------------------------------------------------------------- */

/**
 * Registration render properties
 */
export type RegisterRenderProps =
  & WithStyles<Styles>
  & WithForm<RegisterRequest>

/* ----------------------------------------------------------------------------
 * Presentational component
 * ------------------------------------------------------------------------- */

/**
 * Registration render component
 *
 * @param props - Properties
 *
 * @return JSX element
 */
export const RegisterRender: React.SFC<RegisterRenderProps> =
  ({ classes, form, request, handleChange, handleSubmit }) =>
    <div>
      <Header
        primary={window.env.COGNITO_IDENTITY_POOL_NAME}
        secondary="Register for a new account"
      />
      <Alert
        display={!!form.err || form.success} success={form.success}
        err={form.err}
      >
        We just sent a verification link to your email address. Please
        click on the link to complete your registration.
      </Alert>
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
    </div>

/* ----------------------------------------------------------------------------
 * Enhanced component
 * ------------------------------------------------------------------------- */

/**
 * Registration component
 */
export const Register =
  compose<RegisterRenderProps, {}>(
    withStyles(styles),
    withProps<WithFormProps<RegisterRequest>, {}>(() => ({
      initial: {
        email: "",
        password: ""
      }
    })),
    withForm<RegisterRequest>(),
    pure
  )(RegisterRender)
