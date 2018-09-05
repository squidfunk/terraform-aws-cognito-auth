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
import { ShallowWrapper } from "enzyme"

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
 * Wait the given number of milliseconds
 *
 * @param interval - Interval in milliseconds
 *
 * @return Promise resolving with no result
 */
export function wait(interval: number) {
  return new Promise<void>(resolve => setTimeout(resolve, interval))
}

/**
 * Find a component inside a shallow-wrapped component
 *
 * This is a "simple" wrapper function to ease testing using shallow wrapped
 * components because Enzyme doesn't support it out-of-the-box.
 *
 * @template TProps - Component properties type
 *
 * @param wrapper - Component wrapper
 * @param selector - Selector
 *
 * @return Stateless component
 */
export function find<TProps extends {}>(
  wrapper: ShallowWrapper<TProps>, selector: any
): ShallowWrapper<TProps> {
  const component = wrapper.find<TProps>(selector)
  if (component.exists()) {
    return component
  } else {
    try {
      return find(wrapper.dive(), selector)
    } catch (err) {
      return wrapper.children()
        .reduce<ShallowWrapper<TProps>>((current, child) => {
          return current || find(child, selector)
        }, undefined)
    }
  }
}
