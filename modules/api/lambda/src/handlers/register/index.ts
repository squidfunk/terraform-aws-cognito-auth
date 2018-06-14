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

import { handler } from ".."
import { AuthenticationClient } from "../../clients/authentication"

/* ----------------------------------------------------------------------------
 * Values
 * ------------------------------------------------------------------------- */

/**
 * JSON schema for request
 */
import schema = require("../../common/requests/register/index.json")

/* ----------------------------------------------------------------------------
 * Handlers
 * ------------------------------------------------------------------------- */

/**
 * Register user with email address and password
 *
 * When registering a new user, a Lambda function triggered by Cognito checks
 * if the email address is already registered. The error is pretty cryptic, so
 * we exchange the type and remove unnecessary stuff to minimize confusion.
 *
 * @param event - API Gateway event
 *
 * @return Promise resolving with no result
 */
export const post = handler(schema, async ({ email, password }) => {
  const auth = new AuthenticationClient()
  await auth.register(email, password)
})
