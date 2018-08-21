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

import { SNSEvent } from "aws-lambda"
import { CognitoIdentityServiceProvider, SES } from "aws-sdk"

import { RegisterMessage } from "messages/register"
import { ResetMessage } from "messages/reset"
import { VerificationCode } from "verification"

/* ----------------------------------------------------------------------------
 * Functions
 * ------------------------------------------------------------------------- */

/**
 * Return a message for the given context
 *
 * @param context - Verification context
 *
 * @return Message
 */
function template(code: VerificationCode) {
  switch (code.context) {

    /* Registration verification message */
    case "register":
      return new RegisterMessage({
        name: process.env.COGNITO_IDENTITY_POOL_NAME!,
        domain: process.env.COGNITO_IDENTITY_POOL_PROVIDER!,
        code: code.id
      })

    /* Reset verification message */
    case "reset":
      return new ResetMessage({
        name: process.env.COGNITO_IDENTITY_POOL_NAME!,
        domain: process.env.COGNITO_IDENTITY_POOL_PROVIDER!,
        code: code.id
      })

    /* Catch invalid verification contexts */
    default:
      throw new Error(`Invalid verification context: "${code.context}"`)
  }
}

/* ----------------------------------------------------------------------------
 * Handlers
 * ------------------------------------------------------------------------- */

/**
 * Send email via SNS for verification
 *
 * We hardcode the domain example.com (see RFC 2606) because we don't want SES
 * to send out emails for our acceptance tests, so we know what to check for.
 *
 * @param event - SNS event
 *
 * @return Promise resolving with no result
 */
export function handler(event: SNSEvent): Promise<void> {
  return event.Records.reduce((promise, record) =>
    promise.then(async () => {
      const code: VerificationCode = JSON.parse(record.Sns.Message)
      const [{ UserAttributes }, message] = await Promise.all([

        /* Retrieve user */
        new CognitoIdentityServiceProvider({ apiVersion: "2016-04-18" })
          .adminGetUser({
            UserPoolId: process.env.COGNITO_USER_POOL_ID!,
            Username: code.subject
          }).promise(),

        /* Compose message */
        template(code).compose()
      ])

      /* Retrieve email address from user attributes */
      const { Value: email } = UserAttributes!.find(attr => {
        return attr.Name === "email"
      })!

      /* Send message if it's not a test message */
      if (email && !email.match(/@example\.com$/))
        await new SES({ apiVersion: "2010-12-01" })
          .sendRawEmail({
            Source: process.env.SES_SENDER_ADDRESS!,
            Destinations: [email],
            RawMessage: {
              Data: message.toString()
            }
          }).promise()
    }), Promise.resolve())
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
process.on("unhandledRejection", /* istanbul ignore next */ () => {
  /* Nothing to be done */
})
