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
  AuthenticateActions,
  AuthenticateActionTypes
} from "actions/authenticate"

/* ----------------------------------------------------------------------------
 * Reducers
 * ------------------------------------------------------------------------- */

/**
 * Authentication reducer
 *
 * @param state - Current state
 * @param action - Action
 *
 * @return Updated state
 */
export const authenticateReducer =
  (state = {}, action: AuthenticateActions) => {
    switch (action.type) {

      /* Authentication success action */
      case AuthenticateActionTypes.SUCCESS:
        console.log("Request succeeded", action.session)
        return state

      /* Authentication success action */
      case AuthenticateActionTypes.FAILURE:
        console.log("Request failed", action.err)
        return state

      /* Catch-all */
      default:
        return state
    }
  }
