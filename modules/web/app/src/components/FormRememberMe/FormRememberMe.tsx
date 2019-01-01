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

import { Checkbox } from "@material-ui/core"
import { CheckboxProps } from "@material-ui/core/Checkbox"
import { omit } from "ramda"
import * as React from "react"
import {
  compose,
  mapProps,
  pure,
  setDisplayName,
  withHandlers
} from "recompose"

import {
  withRememberMe,
  WithRememberMe
} from "enhancers"

/* ----------------------------------------------------------------------------
 * Types
 * ------------------------------------------------------------------------- */

/**
 * Form remember me properties
 */
export interface FormRememberMeProps extends CheckboxProps {
  onChange(
    ev: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ): void                              /* Form change handler */
}

/* ------------------------------------------------------------------------- */

/**
 * Handler properties
 */
interface HandlerProps {
  handleChange(
    ev: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ): void                              /* Form change handler */
}

/**
 * Handler callback properties
 */
type HandlerCallbackProps =
  & FormRememberMeProps
  & WithRememberMe

/* ------------------------------------------------------------------------- */

/**
 * Render properties
 */
export type RenderProps =
  & FormRememberMeProps
  & HandlerProps

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
  ({ handleChange, ...props }) =>
    <Checkbox {...props} onChange={handleChange} />

/* ----------------------------------------------------------------------------
 * Enhanced component
 * ------------------------------------------------------------------------- */

/**
 * Enhance component
 *
 * @return Component enhancer
 */
export function enhance() {
  return compose<RenderProps, FormRememberMeProps>(
    withRememberMe(),
    withHandlers<HandlerCallbackProps, HandlerProps>({

      /* Toggle active flag */
      handleChange: ({ onChange, setRememberMe }) => (ev, checked) => {
        onChange(ev, checked)
        setRememberMe(checked)
      }
    }),
    mapProps(omit([
      "remember",
      "setRememberMe",
      "setRememberMeResult"
    ])),
    pure,
    setDisplayName("FormRememberMe")
  )
}

/**
 * Form remember me component
 */
export const FormRememberMe = enhance()(Render)
