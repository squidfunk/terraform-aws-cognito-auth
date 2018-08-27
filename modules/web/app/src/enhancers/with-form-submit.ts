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
  WithNotificationDispatch,
  withSession,
  WithSessionState
} from "enhancers"
import {
  NotificationType
} from "providers/store/notification"

/* ----------------------------------------------------------------------------
 * Types
 * ------------------------------------------------------------------------- */

/**
 * Form submission enhancer options
 */
export interface WithFormSubmitOptions {
  target?: string                      /* Target URL */
  message?: string                     /* Message rendered on success */
  authorize?: boolean                  /* Authorization header necessary */
}

/* ------------------------------------------------------------------------- */

/**
 * State
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
 * State properties
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
 * Handler properties
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
  & WithSessionState
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
  { target, message, authorize }: WithFormSubmitOptions
) =>
  compose<WithFormSubmit<TRequest, TResponse>, {}>(
    withNotification(),
    withSession(),
    withState("form", "setForm", (): State<TResponse> => ({
      pending: false,
      success: false
    })),
    withHandlers<WithFormSubmit<TRequest, TResponse>, HandlerProps<TRequest>>({
      submit: ({
        setForm, displayNotification, dismissNotification, session
      }) => async data => {
        const url = `/${window.env.API_BASE_PATH}/${
          (target || location.pathname).replace(/^\//, "")
        }`

        /* Submit form request */
        setForm({ pending: true, success: false })
        try {
          dismissNotification()
          const { data: response } =
            await axios.post<TResponse>(url, data || {}, {
              withCredentials: true,
              headers: {
                "Content-Type": "application/json",
                ...(authorize && session
                  ? { Authorization: `Bearer ${session.access.token}` }
                  : {})
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

        /* Display error message as notification */
        } catch (err) {
          const { response }: AxiosError = err
          if (response) {
            displayNotification({
              type: NotificationType.ERROR,
              message: response.data.message
            })
          }

          /* Update form submission state with error */
          setForm({ pending: false, success: false, err })
        }
      }
    })
  )
