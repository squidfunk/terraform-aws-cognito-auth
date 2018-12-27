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

// tslint:disable no-commented-code

// import * as fs from "fs"
// import * as path from "path"

import {
  RegisterMessage,
  RegisterMessageData
} from "messages/register"

// import { printMimeMessage } from "_/helpers"

/* ----------------------------------------------------------------------------
 * Tests
 * ------------------------------------------------------------------------- */

/* Registration verification message */
describe("messages/register", () => {

  /* RegisterMessage */
  describe("RegisterMessage", () => {

    // /* Fixture base path */
    // const base = path.resolve(__dirname, "../../../../fixtures/message")

    /* Message data (reproducible for fixtures) */
    const data: RegisterMessageData = {
      name: "Example",
      domain: "example.com",
      code: "1234567890ABCDEF"
    }

    /* #subject */
    describe("#subject", () => {

      /* Test: should return message subject */
      it("should return message subject", () => {
        const message = new RegisterMessage(data)
        expect(message.subject)
          .toEqual(`Activate your ${data.name} account`)
      })
    })

    /* #compose */
    describe("#compose", () => {

      /* Test: should return raw message */
      it("should return raw message", async () => {
        const message = new RegisterMessage(data)
        const raw = (await message.compose()).toString()
        expect(raw.length).toBeGreaterThan(7000) // TODO: just for now
        // expect(printMimeMessage(raw).trim()).toEqual(
        //   fs.readFileSync(path.resolve(base, "register.raw"), "utf8").trim()
        // )
      })
    })
  })
})
