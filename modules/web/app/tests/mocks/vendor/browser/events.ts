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

import * as React from "react"

/* ----------------------------------------------------------------------------
 * Data
 * ------------------------------------------------------------------------- */

/**
 * Mock `React.ChangeEvent<HTMLInputElement>` for text input
 *
 * @param options - Options
 *
 * @return Input change event
 */
export function mockChangeEventForTextInput(
  options: { name: string, value: string }
): React.ChangeEvent<HTMLInputElement> {
  return {
    currentTarget: { type: "text", ...options }
  } as any
}

/**
 * Mock `React.ChangeEvent<HTMLInputElement>` for checkbox input
 *
 * @param options - Options
 *
 * @return Input change event
 */
export function mockChangeEventForCheckboxInput(
  options: { name: string, checked: boolean }
): React.ChangeEvent<HTMLInputElement> {
  return {
    currentTarget: { type: "checkbox", ...options }
  } as any
}

/**
 * Mock `React.ChangeEvent<HTMLFormElement>`
 *
 * @return Submit event
 */
export function mockSubmitEvent(): React.ChangeEvent<HTMLFormElement> {
  return {
    preventDefault: jest.fn()
  } as any
}

/**
 * Mock `React.MouseEvent<HTMLButtonElement>`
 *
 * @return Mouse down event
 */
export function mockMouseDownEvent(): React.MouseEvent<HTMLButtonElement> {
  return {
    preventDefault: jest.fn()
  } as any
}
