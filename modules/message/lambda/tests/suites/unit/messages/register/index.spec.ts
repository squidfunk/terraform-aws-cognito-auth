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

import { decode as unquote } from "quoted-printable"

import {
  RegisterMessage,
  RegisterMessageData
} from "messages/register"

/* ----------------------------------------------------------------------------
 * Tests
 * ------------------------------------------------------------------------- */

/* Registration verification message */
describe("messages/register", () => {

  /* RegisterMessage */
  describe("RegisterMessage", () => {

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

      /* Test: should return composed message */
      it("should return composed message", async () => {
        const message = new RegisterMessage(data)
        const payload = unquote((await message.compose()).toString())
        for (const match of [

          /* Message entity */
          "Content-Type: multipart/mixed;boundary",
          "Subject: Activate your Example account",

          /* Entity containing plain text and HTML entities */
          "Content-Type: multipart/alternative;boundary",

          /* Plain text entity */
          "Content-Type: text/plain; charset=UTF-8",
          "Content-Transfer-Encoding: quoted-printable",

          /* HTML entity */
          "Content-Type: text/html; charset=UTF-8",
          "Content-Transfer-Encoding: quoted-printable",

          /* Attachments */
          "Content-Type: image/png",
          "Content-Transfer-Encoding: base64",
          "Content-Disposition: inline",
          "Content-ID: <user-check.png>"
        ])
          expect(payload).toEqual(jasmine.stringMatching(match))
      })
    })
  })
})
