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
 * @template TResponse - Form response type
 */
interface State<TResponse> {
  pending: boolean                     /* Form submission activity */
  success: boolean                     /* Form submission success */
  response?: TResponse                 /* Form submission result */
  err?: AxiosError                     /* Form submission error */
}

/**
 * Form submission state properties
 *
 * @template TResponse - Form response type
 */
interface StateProps<TResponse> {
  form: Readonly<State<TResponse>>,    /* Form submission state */
  setForm: (
    form: Readonly<State<TResponse>>
  ) => Readonly<State<TResponse>>      /* Form submission state reducer */
}

/**
 * Form submission handler properties
 *
 * @template TRequest - Form request type
 */
interface HandlerProps<TRequest extends {}> {
  submit: (
    request?: TRequest
  ) => Promise<void>                   /* Submit form */
}

/**
 * Form submission enhancer
 *
 * @template TRequest - Form request type
 * @template TResponse - Form response type
 */
export type WithFormSubmit<TRequest extends {} = {}, TResponse = void> =
  & HandlerProps<TRequest>
  & StateProps<TResponse>

/* ----------------------------------------------------------------------------
 * Enhancer
 * ------------------------------------------------------------------------- */

/**
 * Enhance component with form submission state and handlers
 *
 * Credentials need to be enabled for the refresh token to be sent with the
 * authentication request, so it can be stored in a secure HTTP-only cookie.
 *
 * @template TRequest - Form request type
 * @template TResponse - Form response type
 *
 * @return Component enhancer
 */
export const withFormSubmit = <TRequest extends {}, TResponse = void>() =>
  compose<WithFormSubmit<TRequest, TResponse>, {}>(
    withState("form", "setForm", (): State<TResponse> => ({
      pending: false,
      success: false
    })),
    withHandlers<WithFormSubmit<TRequest, TResponse>, HandlerProps<TRequest>>({
      submit: ({ setForm }) => async req => {
        const url = `/${window.env.API_BASE_PATH}/${
          location.pathname.replace(/^\//, "") || "authenticate"
        }`

        /* Submit form request */
        setForm({ pending: true, success: false })
        try {
          const { data: response } =
            await axios.post<TResponse>(url, req || {}, {
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
