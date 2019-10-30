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

import * as cookie from "cookie"

import { SessionToken } from "../../common"

/* ----------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------- */

/**
 * Refresh token cookie name
 */
export const TOKEN_COOKIE_NAME = "__Secure-token"

/**
 * Refresh token cookie path
 */
export const TOKEN_COOKIE_PATH = `/${process.env.API_BASE_PATH}/authenticate`

/* ----------------------------------------------------------------------------
 * Functions
 * ------------------------------------------------------------------------- */

/**
 * Parse refresh token from cookie
 *
 * @param header - Cookie header
 *
 * @return Refresh token
 */
export function parseTokenCookie(value: string) {
  if (!(value && value.length))
    throw new TypeError("Invalid request")
  const { [TOKEN_COOKIE_NAME]: token } = cookie.parse(value)
  return token
}

/**
 * Serialize refresh token for set-cookie header
 *
 * The refresh token is sent back to the client in the body and as a cookie
 * header. While non-browser clients should obtain the refresh token from the
 * body, browser clients will handle the refresh token automatically as it is
 * set via a HTTP-only secure cookie that is not accessible from JavaScript.
 *
 * At no time or circumstance should a browser client store the refresh token
 * in local storage as this will introduce XSS vulnerabilities.
 *
 * @param token - Refresh token
 *
 * @return Serialized cookie
 */
export function issueTokenCookie(
  { token, expires }: SessionToken
) {
  return cookie.serialize(TOKEN_COOKIE_NAME, token, {
    expires,
    domain: process.env.COGNITO_IDENTITY_POOL_PROVIDER!,
    path: TOKEN_COOKIE_PATH,
    secure: true,
    httpOnly: true,
    sameSite: true
  })
}

/**
 * Invalidate refresh token on client
 *
 * @return Serialized cookie
 */
export function resetTokenCookie() {
  return cookie.serialize(TOKEN_COOKIE_NAME, "", {
    expires: new Date(0),
    domain: process.env.COGNITO_IDENTITY_POOL_PROVIDER!,
    path: TOKEN_COOKIE_PATH,
    secure: true,
    httpOnly: true,
    sameSite: true
  })
}
