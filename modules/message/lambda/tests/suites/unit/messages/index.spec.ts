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

import { MessageAttachment } from "~/messages"

import { chance } from "_/helpers"
import {
  TestMessage,
  TestMessageData
} from "_/mocks/messages/test"
import {
  mockFsReaddirWithError,
  mockFsReaddirWithResult,
  mockFsReadFileWithError,
  mockFsReadFileWithResult
} from "_/mocks/vendor/fs"
import {
  mockMimeGetTypeWithError,
  mockMimeGetTypeWithResult
} from "_/mocks/vendor/mime"
import {
  mockMustacheRenderWithError,
  mockMustacheRenderWithResult
} from "_/mocks/vendor/mustache"

/* ----------------------------------------------------------------------------
 * Tests
 * ------------------------------------------------------------------------- */

/* Abstract message */
describe("messages", () => {

  /* Message */
  describe("Message", () => {

    /* Message data */
    const data: TestMessageData = {
      name: chance.string(),
      domain: chance.string(),
      code: chance.string()
    }

    /* #body */
    describe("#body", () => {

      /* Test: should resolve with message body */
      it("should resolve with message body", async () => {
        const template = chance.string()
        mockFsReadFileWithResult()
        mockMustacheRenderWithResult(template)
        const message = new TestMessage(data)
        expect(await message.body()).toEqual({
          html: template,
          text: template
        })
      })

      /* Test: should read templates from disk */
      it("should read templates from disk", async () => {
        const readFileMock = mockFsReadFileWithResult()
        mockMustacheRenderWithResult()
        const message = new TestMessage(data)
        await message.body()
        expect(readFileMock).toHaveBeenCalledWith(
          jasmine.stringMatching(/\/index\.txt$/),
          "utf8",
          jasmine.any(Function)
        )
        expect(readFileMock).toHaveBeenCalledWith(
          jasmine.stringMatching(/\/index\.html$/),
          "utf8",
          jasmine.any(Function)
        )
        expect(readFileMock.calls.all().length).toEqual(2)
      })

      /* Test: should render templates with Mustache */
      it("should render templates with Mustache", async () => {
        const template = chance.string()
        mockFsReadFileWithResult(template)
        const renderMock = mockMustacheRenderWithResult()
        const message = new TestMessage(data)
        await message.body()
        expect(renderMock).toHaveBeenCalledWith(template, data)
        expect(renderMock.calls.all().length).toEqual(2)
      })

      /* Test: should inline attachments */
      it("should inline attachments", async () => {
        const attachment = chance.string()
        mockFsReadFileWithResult()
        mockMustacheRenderWithResult(`attachments/${attachment}`)
        const message = new TestMessage(data)
        expect(await message.body()).toEqual({
          html: `cid:${attachment}`,
          text: `attachments/${attachment}`
        })
      })

      /* Test: should reject on read error */
      it("should reject on read error", async done => {
        const errMock = new Error()
        mockFsReadFileWithError(errMock)
        mockMustacheRenderWithResult()
        try {
          const message = new TestMessage(data)
          await message.body()
          done.fail()
        } catch (err) {
          expect(err).toBe(errMock)
          done()
        }
      })

      /* Test: should reject on render error */
      it("should reject on render error", async done => {
        const errMock = new Error()
        mockFsReadFileWithResult()
        mockMustacheRenderWithError(errMock)
        try {
          const message = new TestMessage(data)
          await message.body()
          done.fail()
        } catch (err) {
          expect(err).toBe(errMock)
          done()
        }
      })
    })

    /* #attachments */
    describe("#attachments", () => {

      const attachment: MessageAttachment = {} // TODO mockMessageAttachment

      /* Test: should resolve with message attachments */
      it("should resolve with message attachments", async () => {
        mockFsReaddirWithResult()
        mockFsReadFileWithResult()
        mockMimeGetTypeWithResult()
        const message = new TestMessage(data)
        expect(await message.attachments()).toEqual({

        })
      })
    })
  })
})
