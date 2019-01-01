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

import { parse } from "query-string"
import { keysIn } from "ramda"
import {
  compose,
  withHandlers
} from "recompose"

import { SessionToken } from "common"

/* ----------------------------------------------------------------------------
 * Types
 * ------------------------------------------------------------------------- */

/**
 * Handler properties
 */
interface HandlerProps {
  callback(
    id: SessionToken<string>
  ): void                              /* Callback */
}

/* ------------------------------------------------------------------------- */

/**
 * Callback enhancer
 */
export type WithCallback =
  & HandlerProps

/* ----------------------------------------------------------------------------
 * Enhancer
 * ------------------------------------------------------------------------- */

/**
 * Enhance component with callback handlers
 *
 * @return Component enhancer
 */
export const withCallback = () =>
  compose<WithCallback, {}>(
    withHandlers<{}, HandlerProps>({

      /* Invoke callback with identity token */
      callback: () => id => {
        const { redirect } = parse(location.search)
        const path: string = (redirect as string || "").replace(/^\//, "")

        /* Build hash fragment from identity token */
        const hash = keysIn(id)
          .map(key => `${key}=${id[key as keyof SessionToken]}`)
          .join("&")

        /* Redirect to location with has fragment */
        location.assign(`//${window.env.APP_ORIGIN}/${path}#${hash}`)
      }
    })
  )
