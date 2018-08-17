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

import { lensProp, set } from "ramda"
import {
  compose,
  withHandlers,
  withState
} from "recompose"

import {
  withFormSubmit,
  WithFormSubmit
} from "enhancers"

/* ----------------------------------------------------------------------------
 * Types
 * ------------------------------------------------------------------------- */

/**
 * Form state properties
 *
 * @template T - Form request type
 */
interface StateProps<T extends {}> {
  request: Readonly<T>,                /* Form state */
  setRequest: (
    request: Readonly<T>
  ) => Readonly<T>                     /* Form state reducer */
}

/**
 * Form handler properties
 */
interface HandlerProps {
  handleChange(
    ev: React.ChangeEvent<HTMLInputElement>
  ): void                              /* Form change handler */
  handleSubmit(
    ev: React.ChangeEvent<HTMLFormElement>
  ): Promise<void>                     /* Form submit handler */
}

/**
 * Form submission enhancer
 *
 * @template S - Form request type
 * @template T - Form response type
 */
export type WithForm<S extends {}, T = void> =
  & WithFormSubmit<S, T>
  & StateProps<S>
  & HandlerProps

/* ----------------------------------------------------------------------------
 * Enhancer
 * ------------------------------------------------------------------------- */

/**
 * Enhance component with form submission state and handlers
 *
 * Credentials need to be enabled for the refresh token to be sent with the
 * authentication request, so it can be stored in a secure HTTP-only cookie.
 *
 * @template S - Form request type
 * @template T - Form response type
 *
 * @param initial - Initial form request
 *
 * @return Component enhancer
 */
export const withForm = <S extends {}, T = void>(initial: S) =>
  compose<WithForm<S, T>, {}>(
    withFormSubmit<S, T>(),
    withState("request", "setRequest", (): S => initial),
    withHandlers<WithForm<S, T>, HandlerProps>({

      /* Update form data */
      handleChange: ({ request, setRequest }) => ev => {
        const { name, value } = ev.currentTarget
        setRequest(set(lensProp(name), value, request))
      },

      /* Submit form data */
      handleSubmit: ({ submit, request }) => ev => {
        ev.preventDefault()
        return submit(request)
      }
    })
  )
