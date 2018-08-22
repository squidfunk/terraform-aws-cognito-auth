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
  Collapse,
  Typography,
  withStyles,
  WithStyles
} from "@material-ui/core"
import { AxiosError } from "axios"
import * as React from "react"
import {
  compose,
  pure
} from "recompose"

import { Styles, styles } from "./Alert.styles"

/* ----------------------------------------------------------------------------
 * Types
 * ------------------------------------------------------------------------- */

/**
 * Alert properties
 */
export interface AlertProps {
  display: boolean                     /* Whether to display the alert */
  success: boolean                     /* Render as error or success */
  err?: AxiosError                     /* Error */
}

/**
 * Alert render properties
 */
export type AlertRenderProps =
  & WithStyles<Styles>
  & AlertProps

/* ----------------------------------------------------------------------------
 * Presentational component
 * ------------------------------------------------------------------------- */

/**
 * Alert render component
 *
 * @param props - Properties
 *
 * @return JSX element
 */
export const AlertRender: React.SFC<AlertRenderProps> =
  ({ classes, children, display, success, err }) =>
    <Collapse in={display}>
      <Typography className={
        `${classes.root} ${success ? classes.success : classes.error}`
      } >
        {err && err.response && err.response.data.message}
        {success && children}
      </Typography>
    </Collapse>

/* ----------------------------------------------------------------------------
 * Enhanced component
 * ------------------------------------------------------------------------- */

/**
 * Alert component
 */
export const Alert =
  compose<AlertRenderProps, AlertProps>(
    withStyles(styles),
    pure
  )(AlertRender)
