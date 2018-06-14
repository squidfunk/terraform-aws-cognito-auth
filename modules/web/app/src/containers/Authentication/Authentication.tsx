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

import { connect, Dispatch } from "react-redux"

import { authenticateRequestAction } from "actions/authenticate"
import { AuthenticateRequestWithCredentials } from "common/requests"
import { AuthenticationForm } from "components/Forms/AuthenticationForm"

/* ----------------------------------------------------------------------------
 * Types
 * ------------------------------------------------------------------------- */

/**
 * Authentification state for Redux
 */
interface StateFromProps {
  authenticated: boolean               /* Whether the user is authenticated */
}

/**
 * Authentification dispatchers for Redux
 */
interface DispatchFromProps {

}

/* ----------------------------------------------------------------------------
 * Functions
 * ------------------------------------------------------------------------- */

/**
 * Map state to properties
 *
 * @param state - State
 *
 * @return Properties
 */
function mapStateToProps(_state: any): StateFromProps {                         // TODO: Store typings
  return {
    authenticated: false
  }
}

/**
 * Map actions to properties and dispatch
 *
 * @param dispatch - Dispatch
 *
 * @return Properties
 */
function mapDispatchToProps(dispatch: Dispatch): DispatchFromProps {
  return {
    handleSubmit(data: AuthenticateRequestWithCredentials) {
      dispatch(authenticateRequestAction(data))
    }
  }
}

/* ----------------------------------------------------------------------------
 * Connected component
 * ------------------------------------------------------------------------- */

/**
 * Connected authentication form component
 */
export const Authentication = connect(
  mapStateToProps,
  mapDispatchToProps
)(AuthenticationForm)
