/*
 * Copyright (c) 2018 Martin Donath <martin.donath@squidfunk.com>
 *
 * All rights reserved. No part of this computer program(s) may be used,
 * reproduced, stored in any retrieval system, or transmitted, in any form or
 * by any means, electronic, mechanical, photocopying, recording, or otherwise
 * without prior written permission.
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
import { CognitoIdentityServiceProvider } from "aws-sdk"

/* ----------------------------------------------------------------------------
 * Handlers
 * ------------------------------------------------------------------------- */

/**
 * Check if email is not already registered
 *
 * This function must return an error if the registration cannot proceed, so
 * we need to use the callback because otherwise unhandled promise rejections
 *
 * @param event - Trigger event
 * @param context - Handler context
 * @param cb - Handler callback
 */
// export function trigger(
//   event: CognitoUserPoolTriggerEvent,
//   _context: Context, cb: Callback
// ) {
//   new CognitoIdentityServiceProvider({
//     apiVersion: "2016-04-18"
//   }).adminGetUser({
//     UserPoolId: event.userPoolId,
//     Username: event.request.userAttributes.email!
//   }, (err: any) => {
//     err.code === "UserNotFoundException"
//       ? cb(undefined, event)
//       : cb(err)
//   })
// }

export async function trigger(
  event: CognitoUserPoolTriggerEvent
): Promise<CognitoUserPoolTriggerEvent> {
  try {
    await new CognitoIdentityServiceProvider({
      apiVersion: "2016-04-18"
    }).adminGetUser({
      UserPoolId: event.userPoolId,
      Username: event.request.userAttributes.email
    }).promise()

    /* Email address already registered, throw error */
    throw new Error("Email address is already registered")

  /* Rethrow all errors except for non-existent user */
  } catch (err) {
    if (!err.code || err.code !== "UserNotFoundException")
      throw err
  }
  return event
}

// (async () => {
//   await trigger({
//     userPoolId: "us-east-1_vxtMRvciP",
//     request: {
//       userAttributes: {
//         email: "do@guc.my"
//       }
//     }
//   } as any)
//   console.log("done")
// })()
