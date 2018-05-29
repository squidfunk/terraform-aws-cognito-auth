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

import { CognitoIdentityServiceProvider } from "aws-sdk"

import { Client } from ".."

/* ----------------------------------------------------------------------------
 * Types
 * ------------------------------------------------------------------------- */

/**
 * Session tokens
 */
export interface Session {
  accessToken: string                  /* Access token */
  refreshToken?: string                /* Refresh token */
}

/* ----------------------------------------------------------------------------
 * Class
 * ------------------------------------------------------------------------- */

/**
 * Session client
 */
export class SessionClient extends Client {

  /**
   * Factory method, necessary for mocking
   *
   * @param session - Session
   * @param cognito - Cognito client
   *
   * @return Session client
   */
  public static factory(
    session: Session,
    cognito = new CognitoIdentityServiceProvider({
      apiVersion: "2016-04-18"
    })
  ) {
    return new SessionClient(session, cognito)
  }

  /**
   * Initialize client with session
   *
   * @param session - Session
   * @param cognito - Cognito client
   */
  protected constructor(
    protected session: Session,
    cognito: CognitoIdentityServiceProvider
  ) {
    super(cognito)
  }

  /**
   * Change password for current user
   *
   * @param previous - Previous password
   * @param proposed - Proposed password
   *
   * @return Promise resolving with no result
   */
  public async changePassword(
    previous: string, proposed: string
  ): Promise<void> {
    await this.cognito.changePassword({
      AccessToken: this.session.accessToken,
      PreviousPassword: previous,
      ProposedPassword: proposed
    }).promise()
  }
}
