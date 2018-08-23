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

import {
  withNotification,
  WithNotificationDispatch
} from "enhancers"
import {
  NotificationType
} from "providers/store/notification"

/* ----------------------------------------------------------------------------
 * Types
 * ------------------------------------------------------------------------- */

/**
 * Form submission options
 */
export interface WithFormSubmitOptions {
  target?: string                      /* Form submission target URL */
  message?: string                     /* Form submission success message */
}

/* ------------------------------------------------------------------------- */

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
    form: State<TResponse>
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

/* ------------------------------------------------------------------------- */

/**
 * Form submission enhancer
 *
 * @template TRequest - Form request type
 * @template TResponse - Form response type
 */
export type WithFormSubmit<TRequest extends {} = {}, TResponse = void> =
  & WithNotificationDispatch
  & StateProps<TResponse>
  & HandlerProps<TRequest>

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
 * @param options - Form submission options
 *
 * @return Component enhancer
 */
export const withFormSubmit = <TRequest extends {}, TResponse = void>(
  { target, message }: WithFormSubmitOptions
) =>
  compose<WithFormSubmit<TRequest, TResponse>, {}>(
    withNotification(),
    withState("form", "setForm", (): State<TResponse> => ({
      pending: false,
      success: false
    })),
    withHandlers<WithFormSubmit<TRequest, TResponse>, HandlerProps<TRequest>>({
      submit: ({
        setForm, displayNotification, dismissNotification
      }) => async req => {
        const url = `/${window.env.API_BASE_PATH}/${
          (target || location.pathname).replace(/^\//, "")
        }`

        /* Submit form request */
        setForm({ pending: true, success: false })
        try {
          dismissNotification()
          const { data: response } =
            await axios.post<TResponse>(url, req || {}, {
              withCredentials: true,
              headers: {
                "Content-Type": "application/json"
              }
            })

          /* Update form submission state with response */
          setForm({ pending: false, success: true, response })

          /* Display success message as notification, if given */
          if (message) {
            displayNotification({
              type: NotificationType.SUCCESS,
              message: message!
            })
          }

        /* Update form submission state with error */
        } catch (err) {
          setForm({ pending: false, success: false, err })

          /* Display error message as notification */
          const { response }: AxiosError = err
          if (response) {
            displayNotification({
              type: NotificationType.ERROR,
              message: response.data.message
            })
          }
        }
      }
    })
  )
