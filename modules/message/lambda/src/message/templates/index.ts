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

import { message } from "emailjs"
import { readdir, readFile } from "fs"
import { getType } from "mime"
import { render } from "mustache"
import * as path from "path"
import { promisify } from "util"

/* ----------------------------------------------------------------------------
 * Types
 * ------------------------------------------------------------------------- */

/**
 * Message body type
 */
export interface MessageBody {
  html: string                         /* HTML message */
  text: string                         /* Plain-text message */
}

/**
 * Message attachment type
 */
export interface MessageAttachment {
  id: string                           /* Attachment identifier */
  path: string                         /* Path to attachment */
  type: string                         /* Mime type */
}

/* ----------------------------------------------------------------------------
 * Class
 * ------------------------------------------------------------------------- */

/**
 * Abstract message base class
 *
 * @template T - Message data type
 */
export abstract class Message<T = {}> {

  /**
   * Initialize message
   *
   * @param template - Template
   * @param data - Message date
   * @param base - Base directory
   */
  public constructor(
    protected template: string,
    protected data: T,
    protected base = path.join(__dirname, template)
  ) {}

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
    const [html, text] = await Promise.all([
      promisify(readFile)(path.resolve(this.base, "index.html"), "utf8"),
      promisify(readFile)(path.resolve(this.base, "index.txt"), "utf8")
    ])
    return {
      html: render(html, this.data).replace(/attachments\//, "cid:"),
      text: render(text, this.data)
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
    return filelist.reduce<MessageAttachment[]>((attachments, file) => {
      const type = getType(file)
      if (type === "image/png") {
        attachments.push({
          id: `cid:${file}`,
          path: path.resolve(base, file),
          type
        })
      }
      return attachments
    }, [])
  }

  /**
   * Return raw message
   *
   * @return Raw message
   */
  public async send(_to?: string): Promise<string> {
    const [body, attachments] = await Promise.all([
      this.body(),
      this.attachments()
    ])

    const stream = message.create({
      from: "you <scifish@gmail.com>",
      to: "someone <scifish@gmail.com>",
      subject: this.subject,
      text: body.text,
      attachment: [
        {
          charset: "utf8",
          data: body.html,
          alternative: true
        },
        ...attachments.map(attachment => ({
          path: attachment.path,
          type: attachment.type,
          headers: {
            "Content-ID": attachment.id
          }
        }))
      ]
    }).stream()

    return new Promise<string>((resolve, reject) => {
      stream.on("data", resolve)
      stream.on("error", reject)
    })
  }
}

/* ----------------------------------------------------------------------------
 * Re-export templates
 * ------------------------------------------------------------------------- */

export { RegisterMessage } from "./register"
export { ResetMessage } from "./reset"
