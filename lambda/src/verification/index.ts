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

import { DynamoDB } from "aws-sdk"
import { randomBytes } from "crypto"
import { promisify } from "util"

/* ----------------------------------------------------------------------------
 * Types
 * ------------------------------------------------------------------------- */

/**
 * Verification code
 */
export interface VerificationCode {
  id: string                           /* Verification code */
  subject: string                      /* Verification subject */
  expires: number                      /* Verification code validity */
}

/* ----------------------------------------------------------------------------
 * Class
 * ------------------------------------------------------------------------- */

/**
 * Verification provider
 */
export class VerificationProvider {

  /**
   * Initialize DynamoDB client
   *
   * @param dynamodb - DynamoDB client
   */
  public constructor(
    protected dynamodb = new DynamoDB.DocumentClient({
      apiVersion: "2012-08-10"
    })
  ) {}

  /**
   * Issue a verification code for the given subject
   *
   * A code expires one week after creation which is automatically handled by
   * DynamoDB in the background. However, DynamoDB doesn't guarantee that items
   * are deleted the moment they expire which means they will still show up in
   * queries and scans, but we simply don't care if this is the case.
   *
   * @param subject - Verification subject
   *
   * @return Promise resolving with verification code
   */
  public async issue(subject: string): Promise<VerificationCode> {
    const code: VerificationCode = {
      id: (await promisify(randomBytes)(16)).toString("hex"),
      subject,
      expires: Math.floor(Date.now() / 1000) + 7 * 24 * 3600
    }
    await this.dynamodb.put({
      TableName: process.env.DYNAMODB_TABLE!,
      Item: code
    }).promise()

    /* Return verification code */
    return code
  }

  /**
   * Claim a verification code
   *
   * The code is claimed and immediately deleted from the DynamoDB table if it
   * exists to ensure that every verification code is only used once.
   *
   * @param code - Verification code
   *
   * @return Promise resolving with verification code
   */
  public async claim(code: string): Promise<VerificationCode> {
    const { Attributes } = await this.dynamodb.delete({
      TableName: process.env.DYNAMODB_TABLE!,
      Key: { code },
      ReturnValues: "ALL_OLD"
    }).promise()

    /* Return verification code or throw error if it did not exist */
    if (!Attributes)
      throw new Error(`Invalid verification code: ${code}`)
    return Attributes as VerificationCode
  }
}
