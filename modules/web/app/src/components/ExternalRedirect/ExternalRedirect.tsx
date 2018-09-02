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

import * as React from "react"
import {
  compose,
  lifecycle,
  pure,
  setDisplayName
} from "recompose"

import { Loading } from "components"

/* ----------------------------------------------------------------------------
 * Types
 * ------------------------------------------------------------------------- */

/**
 * External redirect properties
 */
export interface ExternalRedirectProps {
  href: string                         /* Target URL */
}

/* ------------------------------------------------------------------------- */

/**
 * Lifecycle properties
 */
type LifecycleProps =
  & ExternalRedirectProps

/* ------------------------------------------------------------------------- */

/**
 * Render properties
 */
export type RenderProps =
  & ExternalRedirectProps

/* ----------------------------------------------------------------------------
 * Presentational component
 * ------------------------------------------------------------------------- */

/**
 * Render component
 *
 * @param props - Properties
 *
 * @return JSX element
 */
export const Render: React.SFC<RenderProps> =
  () => <Loading />

/* ----------------------------------------------------------------------------
 * Enhanced component
 * ------------------------------------------------------------------------- */

/**
 * External redirect component
 */
export const ExternalRedirect =
  compose<RenderProps, ExternalRedirectProps>(
    lifecycle<LifecycleProps, {}>({
      componentDidMount() {
        const { href } = this.props
        location.assign(href)
      }
    }),
    pure,
    setDisplayName("ExternalRedirect")
  )(Render)
