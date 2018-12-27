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

import { VerificationCode } from "verification"

import { chance } from "_/helpers"
import { mockVerificationCode } from "_/mocks/verification"

/* ----------------------------------------------------------------------------
 * Data
 * ------------------------------------------------------------------------- */

/**
 * Mock `SNSEvent`
 *
 * @param code - Verification code
 *
 * @return SNS event
 */
export function mockSNSEvent(
  code: VerificationCode = mockVerificationCode()
): SNSEvent {
  return {
    Records: [
      {
        EventSource: chance.string(),
        EventVersion: "1.0",
        EventSubscriptionArn: chance.string(),
        Sns: {
          Type: "Notification",
          MessageId: chance.guid(),
          TopicArn: chance.string(),
          Subject: chance.string(),
          Message: JSON.stringify(code),
          MessageAttributes: {},
          Timestamp: chance.date().toISOString(),
          SignatureVersion: "1",
          Signature: chance.string(),
          SigningCertUrl: chance.url(),
          UnsubscribeUrl: chance.url()
        }
      }
    ]
  }
}
