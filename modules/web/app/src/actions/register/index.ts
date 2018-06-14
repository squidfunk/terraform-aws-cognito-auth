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

import { Action } from "redux"

import { RegisterRequest } from "common/requests"

/* ----------------------------------------------------------------------------
 * Types
 * ------------------------------------------------------------------------- */

/**
 * Registration action types
 */
export enum RegisterActionTypes {
  REQUEST = "REGISTER_REQUEST",
  SUCCESS = "REGISTER_SUCCESS",
  FAILURE = "REGISTER_FAILURE"
}

/* ------------------------------------------------------------------------- */

/**
 * Registration request action
 */
export interface RegisterRequestAction extends Action {
  type: RegisterActionTypes.REQUEST,
  body: RegisterRequest
}

/**
 * Registration success action
 */
export interface RegisterSuccessAction extends Action {
  type: RegisterActionTypes.SUCCESS
}

/**
 * Registration failure action
 */
export interface RegisterFailureAction extends Action {
  type: RegisterActionTypes.FAILURE,
  err: Error
}

/* ----------------------------------------------------------------------------
 * Actions
 * ------------------------------------------------------------------------- */

/**
 * Registration request
 *
 * @param body - Request body
 *
 * @return Action
 */
export const registerRequestAction =
  (body: RegisterRequest): RegisterRequestAction => ({
    type: RegisterActionTypes.REQUEST, body
  })

/**
 * Registration succeeded
 *
 * @param data - Response
 *
 * @return Action
 */
export const registerSuccessAction =
  (): RegisterSuccessAction => ({
    type: RegisterActionTypes.SUCCESS
  })

/**
 * Registration failed
 *
 * @param err - Error
 *
 * @return Action
 */
export const registerFailureAction =
  (err: Error): RegisterFailureAction => ({
    type: RegisterActionTypes.FAILURE, err
  })
