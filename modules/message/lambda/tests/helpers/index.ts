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
 * Print comparable mime message
 *
 * This function normalizes MIME boundaries and removes excess line feeds for
 * easier comparability.
 *
 * @param message - Mime message
 *
 * @return Normalized mime message
 */
export function printMimeMessage(message: string): string {
  message.match(/boundary=(\w+)/g)!
    .map((boundary, index) => {
      const id = boundary.split("=").pop()
      message = message.replace(new RegExp(id!, "g"), `\${boundary-${index}}`)
    })
  return message
    .replace(/\r/g, "")
    .replace(/[a-zA-Z0-9+\/]{3,}\n[a-zA-Z0-9+\/\n]+==?/gm, "\${base64}")
}
