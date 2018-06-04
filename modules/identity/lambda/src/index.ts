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

import { CognitoUserPoolTriggerEvent } from "aws-lambda"
import { CognitoIdentityServiceProvider } from "aws-sdk"

/* ----------------------------------------------------------------------------
 * Handlers
 * ------------------------------------------------------------------------- */

/**
 * Check if email is not already registered
 *
 * @param event - Registration event
 *
 * @return Registration event
 */
export async function trigger(
  event: CognitoUserPoolTriggerEvent
): Promise<CognitoUserPoolTriggerEvent> {
  const { Users } = await new CognitoIdentityServiceProvider({
    apiVersion: "2016-04-18"
  }).listUsers({
    UserPoolId: event.userPoolId,
    Filter: `email="${event.request.userAttributes.email}"`
  }).promise()

  /* If email address is already registered, throw error */
  if (Users!.length)
    throw new Error("Email address already registered")

  /* Otherwise just return event */
  return event
}

/* ----------------------------------------------------------------------------
 * Listeners
 * ------------------------------------------------------------------------- */

/**
 * Top-level Promise rejection handler
 *
 * The Lambda Node 8.10 runtime is great, but it doesn't handle rejections
 * appropriately. Hopefully this will be resolved in the future, but until then
 * we will just swallow the error. This issue was posted in the AWS forums in
 * the following thread: https://amzn.to/2JpoHEY
 */
/* istanbul ignore next */
process.on("unhandledRejection", /* istanbul ignore next */ () => {
  /* Nothing to be done */
})
