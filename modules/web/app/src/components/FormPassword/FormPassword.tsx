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
  FormControl,
  FormHelperText,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  withStyles,
  WithStyles
} from "@material-ui/core"
import { TextFieldProps } from "@material-ui/core/TextField"
import Visibility from "@material-ui/icons/Visibility"
import VisibilityOff from "@material-ui/icons/VisibilityOff"
import * as React from "react"
import {
  compose,
  pure,
  withHandlers,
  withState
} from "recompose"

import { styles, Styles } from "./FormPassword.styles"

/* ----------------------------------------------------------------------------
 * Types
 * ------------------------------------------------------------------------- */

/**
 * Form password properties
 */
export type FormPasswordProps = TextFieldProps

/* ------------------------------------------------------------------------- */

/**
 * Form password state properties
 */
interface StateProps {
  visibility: Readonly<boolean>        /* Visibility state */
  setVisibility: (
    visibility: boolean
  ) => Readonly<boolean>               /* Visibility state reducer */
}

/**
 * Form password handler properties
 */
interface HandlerProps {
  handleClick(
    ev: React.MouseEvent<HTMLButtonElement>
  ): void                              /* Visibility click handler */
  handleMouseDown(
    ev: React.MouseEvent<HTMLButtonElement>
  ): void                              /* Visibility mouse down handler */
}

/* ------------------------------------------------------------------------- */

/**
 * Form password render properties
 */
export type RenderProps =
  & FormPasswordProps
  & WithStyles<Styles>
  & StateProps
  & HandlerProps

/* ----------------------------------------------------------------------------
 * Presentational component
 * ------------------------------------------------------------------------- */

/**
 * Form password render component
 *
 * @param props - Properties
 *
 * @return JSX element
 */
export const Render: React.SFC<RenderProps> =
  ({
    classes, name, label, required, InputProps, value, onChange, autoComplete,
    disabled, error, helperText, visibility, handleClick, handleMouseDown
  }) =>
    <FormControl margin="dense" fullWidth={true} error={error}>
      <InputLabel htmlFor={name} required={false}>{label}</InputLabel>
      <Input
        id={name}
        name={name}
        type={visibility ? "text" : "password"}
        required={required}
        readOnly={InputProps ? InputProps.readOnly : false}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        disabled={disabled}
        endAdornment={
          <InputAdornment position="end" className={classes.adornment}>
            <IconButton
              aria-label="Toggle password visibility"
              onClick={handleClick}
              onMouseDown={handleMouseDown}
              tabIndex={-1}
            >
              {visibility ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        }
      />
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>

/* ----------------------------------------------------------------------------
 * Enhanced component
 * ------------------------------------------------------------------------- */

/**
 * Form password component
 */
export const FormPassword =
  compose<RenderProps, FormPasswordProps>(
    withStyles(styles),
    withState("visibility", "setVisibility", (): boolean => false),
    withHandlers<RenderProps, HandlerProps>({

      /* Toggle visibility */
      handleClick: ({ visibility, setVisibility }) => () => {
        setVisibility(!visibility)
      },

      /* Prevent interference with click event */
      handleMouseDown: () => ev => {
        ev.preventDefault()
      }
    }),
    pure
  )(Render)
