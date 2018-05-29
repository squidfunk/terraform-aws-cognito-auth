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
 * Class
 * ------------------------------------------------------------------------- */

/**
 * Management client
 */
export class ManagementClient extends Client {

  /**
   * Initialize verification and identity provider
   *
   * @param cognito - Cognito client
   */
  public constructor(
    cognito = new CognitoIdentityServiceProvider({
      apiVersion: "2016-04-18"
    })
  ) {
    super(cognito)
  }

  /**
   * Verify user
   *
   * @param username - Username or email
   *
   * @return promise resolving with no result
   */
  public async verifyUser(username: string): Promise<void> {
    await Promise.all([

      /* Confirm user registration */
      await this.cognito.adminConfirmSignUp({
        UserPoolId: process.env.COGNITO_USER_POOL!,
        Username: username
      }).promise(),

      /* Verify email address */
      await this.cognito.adminUpdateUserAttributes({
        UserPoolId: process.env.COGNITO_USER_POOL!,
        Username: username,
        UserAttributes: [
          {
            Name: "email_verified",
            Value: "true"
          }
        ]
      }).promise()
    ])
  }

  /**
   * Change password for user
   *
   * Hack: Cognito doesn't allow us to change the password of a user without
   * his consent, so we have to work around this in order to implement our own
   * customized authentication flow by deleting and re-creating the user.
   * Hopefully, this issue will be adressed: https://amzn.to/2snEPMm
   *
   * @param username - Username or email
   * @param password - Password
   *
   * @return Promise resolving with no result
   */
  public async changePassword(
    username: string, password: string
  ): Promise<void> {
    const { Username, UserAttributes } = await this.cognito.adminGetUser({
      UserPoolId: process.env.COGNITO_USER_POOL!,
      Username: username
    }).promise()

    /* Check is user attributes were set */
    if (!UserAttributes)
      throw new Error(`Invalid user: "${Username}" has no attributes`)

    /* Delete user */
    await this.cognito.adminDeleteUser({
      UserPoolId: process.env.COGNITO_USER_POOL!,
      Username
    }).promise()

    /* Re-create user */
    await this.cognito.signUp({
      ClientId: process.env.COGNITO_USER_POOL_CLIENT!,
      Username,
      Password: password,
      UserAttributes: UserAttributes.filter(attr => {
        return ["sub", "email_verified"].indexOf(attr.Name) === -1
      })
    }).promise()

    /* Auto-verify user */
    await this.verifyUser(Username)
  }
}
