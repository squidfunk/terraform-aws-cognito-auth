
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

import { AxiosError } from "axios"
import { withProps } from "recompose"

import * as _ from "enhancers"

import { mockAxiosError } from "_/mocks/vendor/axios"

/* ----------------------------------------------------------------------------
 * Functions
 * ------------------------------------------------------------------------- */

/**
 * Mock form submission component enhancer
 *
 * @template TRequest - Form request type
 * @template TResponse - Form response type
 *
 * @return Component enhancer
 */
export function mockWithFormSubmit<
  TRequest extends {} = any, TResponse = void
>() {
  return spyOn(_, "withFormSubmit")
    .and.callFake(() => withProps<_.WithFormSubmit<TRequest, TResponse>, {}>({
      form: {
        pending: false,
        success: false
      },
      setForm: jest.fn(),
      submit: jest.fn()
    }))
}

/**
 * Mock form submission component enhancer with pending request
 *
 * @template TRequest - Form request type
 * @template TResponse - Form response type
 *
 * @return Component enhancer
 */
export function mockWithFormSubmitWithPending<
  TRequest extends {} = any, TResponse = void
>() {
  return spyOn(_, "withFormSubmit")
    .and.callFake(() => withProps<_.WithFormSubmit<TRequest, TResponse>, {}>({
      form: {
        pending: true,
        success: false
      },
      setForm: jest.fn(),
      submit: jest.fn()
    }))
}

/**
 * Mock form submission component enhancer returning with result
 *
 * @template TRequest - Form request type
 * @template TResponse - Form response type
 *
 * @param response - Form submission result
 *
 * @return Component enhancer
 */
export function mockWithFormSubmitWithResult<
  TRequest extends {} = any, TResponse = void
>(response?: TResponse) {
  return spyOn(_, "withFormSubmit")
    .and.callFake(() => withProps<_.WithFormSubmit<TRequest, TResponse>, {}>({
      form: {
        pending: false,
        success: true,
        response
      },
      setForm: jest.fn(),
      submit: jest.fn()
    }))
}

/**
 * Mock form submission component enhancer returning with error
 *
 * @template TRequest - Form request type
 * @template TResponse - Form response type
 *
 * @param err - Form submission error
 *
 * @return Component enhancer
 */
export function mockWithFormSubmitWithError<
  TRequest extends {} = any, TResponse = void
>(err: AxiosError = mockAxiosError()) {
  return spyOn(_, "withFormSubmit")
    .and.callFake(() => withProps<_.WithFormSubmit<TRequest, TResponse>, {}>({
      form: {
        pending: false,
        success: false,
        err
      },
      setForm: jest.fn(),
      submit: jest.fn()
    }))
}
