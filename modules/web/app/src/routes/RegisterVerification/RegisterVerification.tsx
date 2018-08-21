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
  withStyles,
  WithStyles
} from "@material-ui/core"
import * as React from "react"
import {
  branch,
  compose,
  lifecycle,
  pure,
  renderComponent
} from "recompose"

import { RegisterVerificationRequest } from "common"
import {
  withFormSubmit,
  WithFormSubmit
} from "enhancers"

import { Styles, styles } from "./RegisterVerification.styles"
import { RegisterVerificationSuccess } from "./RegisterVerificationSuccess"

/* ----------------------------------------------------------------------------
 * Types
 * ------------------------------------------------------------------------- */

/**
 * Registration verification render properties
 */
export type RegisterVerificationRenderProps =
  & WithStyles<Styles>
  & WithFormSubmit<RegisterVerificationRequest>

/* ----------------------------------------------------------------------------
 * Presentational component
 * ------------------------------------------------------------------------- */

/**
 * Registration verification render component
 */
export const RegisterVerificationRender:
  React.SFC<RegisterVerificationRenderProps> =
    () =>
      <div>Verifying...</div>

/* ----------------------------------------------------------------------------
 * Enhanced component
 * ------------------------------------------------------------------------- */

/**
 * Registration verification component
 */
export const RegisterVerification =
  compose<RegisterVerificationRenderProps, {}>(
    withStyles(styles),
    withFormSubmit<RegisterVerificationRequest>(),
    lifecycle<RegisterVerificationRenderProps, {}>({
      componentDidMount() {
        return this.props.submit()
      }
    }),
    branch<RegisterVerificationRenderProps>(
      ({ form }) => form.success,
      renderComponent(RegisterVerificationSuccess)
    ),
    pure
  )(RegisterVerificationRender)
