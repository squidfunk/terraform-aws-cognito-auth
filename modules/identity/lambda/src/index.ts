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

import { CognitoUserPoolTriggerEvent } from "aws-lambda"
import { handler as registerHandler } from './identity'
import { handler as postConfirmHandler } from './postConfirmation'

/* ----------------------------------------------------------------------------
 * Handlers
 * ------------------------------------------------------------------------- */

/**
 * Check if email is not already registered
 *
 * @param event - User pool trigger event
 *
 * @return Promise resolving with user pool trigger event
 */
export async function handler(
  event: CognitoUserPoolTriggerEvent
): Promise<CognitoUserPoolTriggerEvent> {
  switch (event.triggerSource) {
    default:
    case 'PreSignUp_SignUp':
      return registerHandler(event);
    case 'PostConfirmation_ConfirmForgotPassword':
    case 'PostConfirmation_ConfirmSignUp':
      return postConfirmHandler(event);
  }
}
