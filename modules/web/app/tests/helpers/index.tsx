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

import { Chance } from "chance"
import {
  ShallowWrapper,
  StatelessComponent
} from "enzyme"
import * as React from "react"

/* ----------------------------------------------------------------------------
 * Data
 * ------------------------------------------------------------------------- */

/**
 * Chance.js instance to generate random values
 */
export const chance = new Chance()

/* ----------------------------------------------------------------------------
 * Functions
 * ------------------------------------------------------------------------- */

/**
 * Create a placeholder component accepting the given properties
 *
 * @return Stateless component
 */
export function placeholder<T>(): StatelessComponent<T> {
  return () => <div />
}

/**
 * Deep-dive to find a stateless component inside a shallow-wrapped component
 *
 * This is a simple wrapper function to ease testing using shallow wrapped
 * components because Enzyme doesn't support it out-of-the-box.
 *
 * @template TProps - Component properties type
 *
 * @param wrapper - Component wrapper
 * @param selector - Selector
 *
 * @return Stateless component
 */
export function search<TProps extends {}>(
  wrapper: ShallowWrapper<TProps>,
  selector: React.SFC<TProps> | string
): ShallowWrapper<TProps> {
  const component = wrapper.find<TProps>(
    selector as StatelessComponent<TProps>
  )
  return !component.exists()
    ? search(wrapper.dive(), selector)
    : component
}
