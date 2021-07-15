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

// tslint:disable no-duplicate-string

import { readFile, readdir } from "fs"
import { getType } from "mime"
import { Entity, factory } from "mimemessage"
import { render } from "mustache"
import * as path from "path"
import { encode as quote } from "quoted-printable"
import { promisify } from "util"

/* ----------------------------------------------------------------------------
 * Types
 * ------------------------------------------------------------------------- */

/**
 * Message body type
 */
export interface MessageBody {
  text: string                         /* Plain-text message */
  html: string                         /* HTML message */
}

/**
 * Message attachment type
 */
export interface MessageAttachment {
  id: string                           /* Attachment identifier */
  type: string                         /* Attachment mime type */
  data: string                         /* Attachment data */
}

/* ----------------------------------------------------------------------------
 * Class
 * ------------------------------------------------------------------------- */

/**
 * Abstract message base class
 *
 * @template TData - Message data type
 */
export abstract class Message<TData> {

  /**
   * Base directory
   */
  protected base: string

  /**
   * Initialize message
   *
   * @param template - Template
   * @param data - Message data
   */
  public constructor(
    protected template: string,
    protected data: TData
  ) {
    this.base = path.join(__dirname, "..", template)
  }

  /**
   * Return message subject
   *
   * @return Message subject
   */
  public abstract get subject(): string

  /**
   * Return message body
   *
   * @return Promise resolving with message body
   */
  public async body(): Promise<MessageBody> {
    const [text, html] = await Promise.all([
      promisify(readFile)(path.resolve(this.base, "index.txt"), "utf8"),
      promisify(readFile)(path.resolve(this.base, "index.html"), "utf8")
    ])
    return {
      text: render(text, this.data),
      html: render(html, this.data).replace(/attachments\//, "cid:")
    }
  }

  /**
   * Return message attachments
   *
   * @return Promise resolving with message attachments
   */
  public async attachments(): Promise<MessageAttachment[]> {
    const base = path.resolve(this.base, "attachments")
    const filelist = await promisify(readdir)(base)
    return Promise.all(filelist
      .filter(file => getType(file) === "image/png")
      .map(async file => {
        const data = await promisify(readFile)(path.resolve(base, file))
        return {
          id: file,
          type: getType(file)!,
          data: data.toString("base64").match(/.{1,76}/g)!.join("\r\n")
        }
      }))
  }

  /**
   * Compose MIME message
   *
   * @return Mime entity
   */
  public async compose(): Promise<Entity> {
    const [body, attachments] = await Promise.all([
      this.body(),
      this.attachments()
    ])

    /* Compose message entity */
    const message = factory({
      contentType: "multipart/mixed",
      body: [

        /* Entity containing plain text and HTML entities */
        factory({
          contentType: "multipart/alternative",
          body: [

            /* Plain text entity */
            factory({
              contentType:  "text/plain; charset=UTF-8",
              contentTransferEncoding: "quoted-printable",
              body: quote(body.text)
            }),

            /* HTML entity */
            factory({
              contentType:  "text/html; charset=UTF-8",
              contentTransferEncoding: "quoted-printable",
              body: quote(body.html)
            })
          ]
        }),

        /* Attachment entities */
        ...attachments.map(attachment => {
          const entity = factory({
            contentType: attachment.type,
            contentTransferEncoding: "base64",
            body: attachment.data
          })
          entity.header("Content-Disposition", "inline")
          entity.header("Content-ID", `<${attachment.id}>`)
          return entity
        })
      ]
    })

    /* Set subject and return MIME entity */
    message.header("Subject", this.subject)
    return message
  }
}
