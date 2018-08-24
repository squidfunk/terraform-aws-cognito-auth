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

import { Checkbox } from "@material-ui/core"
import { CheckboxProps } from "@material-ui/core/Checkbox"
import * as React from "react"
import {
  compose,
  pure,
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
export type FormRememberMeProps = CheckboxProps

/* ------------------------------------------------------------------------- */

/**
 * Form remember me handler properties
 */
interface HandlerProps {
  handleChange(
    ev: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ): void                              /* Form change handler */
}

/* ------------------------------------------------------------------------- */

/**
 * Form remember me render properties
 */
export type RenderProps =
  & FormRememberMeProps
  & WithRememberMe
  & HandlerProps

/* ----------------------------------------------------------------------------
 * Presentational component
 * ------------------------------------------------------------------------- */

/**
 * Form remember me render component
 *
 * @param props - Properties
 *
 * @return JSX element
 */
export const Render: React.SFC<RenderProps> =
  ({ name, checked, handleChange }) =>
    <Checkbox name={name} checked={checked} onChange={handleChange} />

/* ----------------------------------------------------------------------------
 * Enhanced component
 * ------------------------------------------------------------------------- */

/**
 * Form remember me component
 */
export const FormRememberMe =
  compose<RenderProps, FormRememberMeProps>(
    withRememberMe(),
    withHandlers<RenderProps, HandlerProps>({

      /* Toggle visibility */
      handleChange: ({ onChange, setRememberMe }) => (ev, checked) => {
        if (onChange) {
          onChange(ev, checked)
          setRememberMe(checked)
        }
      }
    }),
    pure
  )(Render)
