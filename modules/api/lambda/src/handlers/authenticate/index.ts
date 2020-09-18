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
import * as jsonwebtoken from 'jsonwebtoken';
import { AuthenticationClient } from "../../clients"
import {
  AuthenticateRequestWithCredentials,
  AuthenticateRequestWithToken,
  Session
} from "../../common"
import {
  issueTokenCookie,
  parseTokenCookie,
  resetTokenCookie
} from "../../utilities"
import { handler } from "../_"

import schema = require("../../common/events/authenticate/index.json")

/* ----------------------------------------------------------------------------
 * Types
 * ------------------------------------------------------------------------- */

/**
 * Authentication request (intersection type to omit complex type guards)
 */
type Request =
  & AuthenticateRequestWithCredentials
  & AuthenticateRequestWithToken

/* ----------------------------------------------------------------------------
 * Handler
 * ------------------------------------------------------------------------- */

/**
 * Authenticate using credentials or refresh token
 *
 * @param event - API Gateway event
 *
 * @return Promise resolving with session
 */
export const post = handler<{}, Request, Session>(schema,
  async ({ headers, body: { username, password, remember, token } }) => {
    const auth = new AuthenticationClient()

    /* Authenticate with credentials; return refresh token if requested */
    if (username && password) {
      const { refresh, ...body } =
        await auth.authenticateWithCredentials(username, password)
      const zohoId = jsonwebtoken.decode(body.id.token);
      return {
        body: remember ? { ...body, zohoId, refresh } : { ...body, zohoId },
        ...(remember && refresh
          ? {
              headers: {
                "Set-Cookie": issueTokenCookie(refresh)
              }
            }
          : {})
      }

    /* Authenticate with refresh token */
    } else {
      token = token || parseTokenCookie(headers.Cookie)
      try {
        const session = await auth.authenticateWithToken(token)
        const zohoId = jsonwebtoken.decode(session.id.token);
        return {
          body: { ...session, zohoId }
        }
      } catch (err) {
        err.code = err.code || err.name
        return {
          statusCode: err.statusCode || 400,
          body: {
            type: err.code,
            message: err.message.replace(/\.$/, "")
          },
          headers: {
            "Set-Cookie": resetTokenCookie()
          }
        }
      }
    }
  })
