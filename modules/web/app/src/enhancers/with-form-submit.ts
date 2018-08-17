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
  AxiosError,
  default as axios
} from "axios"
import {
  compose,
  withHandlers,
  withState
} from "recompose"

/* ----------------------------------------------------------------------------
 * Types
 * ------------------------------------------------------------------------- */

/**
 * Form submission state
 *
 * @template T - Form response type
 */
interface State<T> {
  pending: boolean                     /* Form submission activity */
  success: boolean                     /* Form submission success */
  response?: T                         /* Form submission result */
  err?: AxiosError                     /* Form submission error */
}

/**
 * Form submission state properties
 *
 * @template T - Form response type
 */
interface StateProps<T> {
  form: Readonly<State<T>>,            /* Form submission state */
  setForm: (
    form: Readonly<State<T>>
  ) => Readonly<State<T>>              /* Form submission state reducer */
}

/**
 * Form submission handler properties
 *
 * @template T - Form request type
 */
interface HandlerProps<T extends {}> {
  submit: (
    request?: T
  ) => Promise<void>                   /* Submit form */
}

/**
 * Form submission enhancer
 *
 * @template S - Form request type
 * @template T - Form response type
 */
export type WithFormSubmit<S extends {} = {}, T = void> =
  & StateProps<T>
  & HandlerProps<S>

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
 * @return Component enhancer
 */
export const withFormSubmit = <S extends {}, T = void>() =>
  compose<WithFormSubmit<S, T>, {}>(
    withState("form", "setForm", (): State<T> => ({
      pending: false,
      success: false
    })),
    withHandlers<WithFormSubmit<S, T>, HandlerProps<S>>({
      submit: ({ setForm }) => async req => {
        const url = `/${window.env.API_BASE_PATH}/${
          location.pathname.replace(/^\//, "") || "authenticate"
        }`

        /* Submit form request */
        setForm({ pending: true, success: false })
        try {
          const { data: response } = await axios.post<T>(url, req || {}, {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json"
            }
          })

          /* Update form submission state with response */
          setForm({ pending: false, success: true, response })

        /* Update form submission state with error */
        } catch (err) {
          setForm({ pending: false, success: false, err })
        }
      }
    })
  )
