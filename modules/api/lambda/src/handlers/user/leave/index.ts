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

import { SessionClient } from "clients/session"
import { UserLeaveRequest } from "common"
import { handler } from "handlers"

import schema = require("common/events/user/leave/index.json")
import {
  parseTokenFromHeader,
  resetTokenCookie
} from "utilities"

/* ----------------------------------------------------------------------------
 * Handler
 * ------------------------------------------------------------------------- */

/**
 * Terminate the session associated with the given access token
 *
 * @param event - API Gateway event
 *
 * @return Promise resolving with session
 */
export const post = handler<{}, UserLeaveRequest>(schema,
  async ({ headers }) => {
    const token = parseTokenFromHeader(headers.Authorization)
    try {
      const session = new SessionClient(token)
      await session.signOut()
      return {
        statusCode: 204,
        headers: {
          "Set-Cookie": resetTokenCookie()
        }
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
  })
