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

import { MessageAttachment } from "messages"

import { chance } from "_/helpers"
import {
  TestMessage,
  TestMessageData
} from "_/mocks/messages/test"
import {
  mockFsReadFileWithError,
  mockFsReadFileWithResult,
  mockFsReaddirWithError,
  mockFsReaddirWithResult
} from "_/mocks/vendor/fs"
import {
  mockMimeGetTypeWithError,
  mockMimeGetTypeWithResult
} from "_/mocks/vendor/mime"
import {
  mockMimeMessageEntity,
  mockMimeMessageFactoryWithError,
  mockMimeMessageFactoryWithResult
} from "_/mocks/vendor/mimemessage"
import {
  mockMustacheRenderWithError,
  mockMustacheRenderWithResult
} from "_/mocks/vendor/mustache"
import {
  mockQuotedPrintableEncodeWithError,
  mockQuotedPrintableEncodeWithSuccess
} from "_/mocks/vendor/quoted-printable"

/* ----------------------------------------------------------------------------
 * Tests
 * ------------------------------------------------------------------------- */

/* Abstract message */
describe("messages/_", () => {

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

      /* Test: should reject on fs error (read file) */
      it("should reject on fs error (read file)", async done => {
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

      /* Test: should reject on Mustache error (render) */
      it("should reject on Mustache error (render)", async done => {
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

      /* File list */
      const files = [chance.string(), chance.string()]

      /* Test: should resolve with message attachments */
      it("should resolve with message attachments", async () => {
        const contents = chance.string()
        mockFsReaddirWithResult(files)
        mockFsReadFileWithResult(contents)
        mockMimeGetTypeWithResult()
        const message = new TestMessage(data)
        expect(await message.attachments()).toEqual(
          files.map<MessageAttachment>(id => ({
            id,
            type: "image/png",
            data: contents
          }))
        )
      })

      /* Test: should skip non-image mime types */
      it("should skip non-image mime types", async () => {
        mockFsReaddirWithResult(files)
        mockFsReadFileWithResult()
        mockMimeGetTypeWithResult(chance.string())
        const message = new TestMessage(data)
        expect(await message.attachments()).toEqual([])
      })

      /* Test: should reject on fs error (read directory) */
      it("should reject on fs error (read directory)", async done => {
        const errMock = new Error()
        mockFsReaddirWithError(errMock)
        mockFsReadFileWithResult()
        mockMimeGetTypeWithResult()
        try {
          const message = new TestMessage(data)
          await message.attachments()
          done.fail()
        } catch (err) {
          expect(err).toBe(errMock)
          done()
        }
      })

      /* Test: should reject on fs error (read file) */
      it("should reject on fs error (read file)", async done => {
        const errMock = new Error()
        mockFsReaddirWithResult()
        mockFsReadFileWithError(errMock)
        mockMimeGetTypeWithResult()
        try {
          const message = new TestMessage(data)
          await message.attachments()
          done.fail()
        } catch (err) {
          expect(err).toBe(errMock)
          done()
        }
      })

      /* Test: should reject on invalid mime type */
      it("should reject on invalid mime type", async done => {
        const errMock = new Error()
        mockFsReaddirWithResult()
        mockFsReadFileWithResult()
        mockMimeGetTypeWithError(errMock)
        try {
          const message = new TestMessage(data)
          await message.attachments()
          done.fail()
        } catch (err) {
          expect(err).toBe(errMock)
          done()
        }
      })
    })

    /* #compose */
    describe("#compose", () => {

      /* File list */
      const files = [chance.string()]

      /* Mock body and attachment calls */
      beforeEach(() => {
        mockFsReaddirWithResult(files)
        mockFsReadFileWithResult()
        mockMimeGetTypeWithResult()
      })

      /* Test: should resolve with composed mime entity */
      it("should resolve with composed mime entity", async () => {
        const entity = mockMimeMessageEntity()
        mockMimeMessageFactoryWithResult(entity)
        mockQuotedPrintableEncodeWithSuccess()
        const message = new TestMessage(data)
        expect(await message.compose()).toEqual(entity)
      })

      /* Test: should contain a multipart/mixed mime entity */
      it("should contain a multipart/mixed mime entity", async () => {
        const factoryMock = mockMimeMessageFactoryWithResult()
        mockQuotedPrintableEncodeWithSuccess()
        const message = new TestMessage(data)
        await message.compose()
        expect(factoryMock.calls.count()).toEqual(5)
        expect(factoryMock.calls.all()[4].args).toEqual([{
          contentType: "multipart/mixed",
          body: jasmine.any(Array)
        }])
      })

      /* Test: should contain a multipart/alternative mime entity */
      it("should contain a ├ multipart/alternative mime entity", async () => {
        const factoryMock = mockMimeMessageFactoryWithResult()
        mockQuotedPrintableEncodeWithSuccess()
        const message = new TestMessage(data)
        await message.compose()
        expect(factoryMock.calls.count()).toEqual(5)
        expect(factoryMock.calls.all()[2].args).toEqual([{
          contentType: "multipart/alternative",
          body: jasmine.any(Array)
        }])
      })

      /* Test: should contain a text/plain mime entity */
      it("should contain a │ ├ text/plain mime entity", async () => {
        const factoryMock = mockMimeMessageFactoryWithResult()
        mockQuotedPrintableEncodeWithSuccess()
        const message = new TestMessage(data)
        await message.compose()
        expect(factoryMock.calls.count()).toEqual(5)
        expect(factoryMock.calls.all()[0].args).toEqual([{
          contentType: "text/plain; charset=UTF-8",
          contentTransferEncoding: "quoted-printable",
          body: jasmine.any(String)
        }])
      })

      /* Test: should contain a text/html mime entity */
      it("should contain a │ └ text/html mime entity", async () => {
        const factoryMock = mockMimeMessageFactoryWithResult()
        mockQuotedPrintableEncodeWithSuccess()
        const message = new TestMessage(data)
        await message.compose()
        expect(factoryMock.calls.count()).toEqual(5)
        expect(factoryMock.calls.all()[1].args).toEqual([{
          contentType: "text/html; charset=UTF-8",
          contentTransferEncoding: "quoted-printable",
          body: jasmine.any(String)
        }])
      })

      /* Test: should contain a image/png mime entity */
      it("should contain a └ image/png mime entity", async () => {
        const factoryMock = mockMimeMessageFactoryWithResult()
        mockQuotedPrintableEncodeWithSuccess()
        const message = new TestMessage(data)
        await message.compose()
        expect(factoryMock.calls.count()).toEqual(5)
        expect(factoryMock.calls.all()[3].args).toEqual([{
          contentType: "image/png",
          contentTransferEncoding: "base64",
          body: jasmine.any(String)
        }])
      })

      /* Test: should encode text entities as quoted-printable */
      it("should encode text entities as quoted-printable", async () => {
        mockMimeMessageFactoryWithResult()
        const encodeMock = mockQuotedPrintableEncodeWithSuccess()
        const message = new TestMessage(data)
        await message.compose()
        expect(encodeMock).toHaveBeenCalledTimes(2)
      })

      /* Test: should set content disposition header */
      it("should set content disposition header", async () => {
        const entity = mockMimeMessageEntity()
        mockMimeMessageFactoryWithResult(entity)
        mockQuotedPrintableEncodeWithSuccess()
        const message = new TestMessage(data)
        await message.compose()
        expect(entity.header.calls.count()).toEqual(3)
        expect(entity.header.calls.all()[2].args)
          .toEqual(["Subject", jasmine.any(String) as any])
      })

      /* Test: should set content disposition header */
      it("should set content disposition header", async () => {
        const entity = mockMimeMessageEntity()
        mockMimeMessageFactoryWithResult(entity)
        mockQuotedPrintableEncodeWithSuccess()
        const message = new TestMessage(data)
        await message.compose()
        expect(entity.header.calls.count()).toEqual(3)
        expect(entity.header.calls.all()[1].args)
          .toEqual(["Content-ID", jasmine.stringMatching(/^<.*>$/) as any])
      })

      /* Test: should set content disposition header */
      it("should set content disposition header", async () => {
        const entity = mockMimeMessageEntity()
        mockMimeMessageFactoryWithResult(entity)
        mockQuotedPrintableEncodeWithSuccess()
        const message = new TestMessage(data)
        await message.compose()
        expect(entity.header.calls.count()).toEqual(3)
        expect(entity.header.calls.all()[0].args)
          .toEqual(["Content-Disposition", "inline"])
      })

      /* Test: should reject on compose error */
      it("should reject on compose error", async done => {
        const errMock = new Error()
        mockMimeMessageFactoryWithError(errMock)
        mockQuotedPrintableEncodeWithSuccess()
        try {
          const message = new TestMessage(data)
          await message.compose()
          done.fail()
        } catch (err) {
          expect(err).toBe(errMock)
          done()
        }
      })

      /* Test: should reject on quoting error */
      it("should reject on quoting error", async done => {
        const errMock = new Error()
        mockMimeMessageFactoryWithResult()
        mockQuotedPrintableEncodeWithError(errMock)
        try {
          const message = new TestMessage(data)
          await message.compose()
          done.fail()
        } catch (err) {
          expect(err).toBe(errMock)
          done()
        }
      })
    })
  })
})
