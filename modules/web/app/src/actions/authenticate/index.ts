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

import { AuthenticateRequest } from "common/requests"
import { Session } from "common/session"

/* ----------------------------------------------------------------------------
 * Types
 * ------------------------------------------------------------------------- */

/**
 * Authentication action types
 */
export enum AuthenticateActionTypes {
  REQUEST = "AUTHENTICATE_REQUEST",
  SUCCESS = "AUTHENTICATE_SUCCESS",
  FAILURE = "AUTHENTICATE_FAILURE"
}

/* ------------------------------------------------------------------------- */

/**
 * Authentication request action
 */
export interface AuthenticateRequestAction extends Action {
  type: AuthenticateActionTypes.REQUEST,
  body: AuthenticateRequest
}

/**
 * Authentication success action
 */
export interface AuthenticateSuccessAction extends Action {
  type: AuthenticateActionTypes.SUCCESS,
  session: Session
}

/**
 * Authentication failure action
 */
export interface AuthenticateFailureAction extends Action {
  type: AuthenticateActionTypes.FAILURE,
  err: Error
}

/* ------------------------------------------------------------------------- */

/**
 * Authentication actions
 */
export type AuthenticateActions =
  | AuthenticateRequestAction
  | AuthenticateSuccessAction
  | AuthenticateFailureAction

/* ----------------------------------------------------------------------------
 * Actions
 * ------------------------------------------------------------------------- */

/**
 * Authentication request
 *
 * @param body - Request body
 *
 * @return Action
 */
export const authenticateRequestAction =
  (body: AuthenticateRequest): AuthenticateRequestAction => ({
    type: AuthenticateActionTypes.REQUEST, body
  })

/**
 * Authentication succeeded
 *
 * @param session - Session
 *
 * @return Action
 */
export const authenticateSuccessAction =
  (session: Session): AuthenticateSuccessAction => ({
    type: AuthenticateActionTypes.SUCCESS, session
  })

/**
 * Authentication failed
 *
 * @param err - Error
 *
 * @return Action
 */
export const authenticateFailureAction =
  (err: Error): AuthenticateFailureAction => ({
    type: AuthenticateActionTypes.FAILURE, err
  })
