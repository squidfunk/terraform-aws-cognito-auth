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

import { CognitoIdentityServiceProvider } from "aws-sdk"
import { message } from "emailjs"

import { VerificationCode } from "../verification"
import {
  // MessageTemplate,
  RegisterTemplate,
  // ResetTemplate
} from "./templates"

/* ----------------------------------------------------------------------------
 * Class
 * ------------------------------------------------------------------------- */

/**
 * Message
 */
export class Message {

  /**
   * Initialize message
   *
   * @param code - Verification code
   * @param cognito - Cognito client
   */
  public constructor(
    protected code: VerificationCode,
    protected cognito = new CognitoIdentityServiceProvider({
      apiVersion: "2016-04-18"
    })
  ) {}

  /**
   * Compose and send message
   *
   * @return Promise resolving with no result
   */
  public async send(): Promise<void> {
    const { UserAttributes } =
      await this.cognito.adminGetUser({
        UserPoolId: process.env.COGNITO_USER_POOL!,
        Username: this.code.subject
      }).promise()

    /* Retrieve email address from user attributes */
    const { Value: email } = UserAttributes!.find(attr => {
      return attr.Name === "email"
    })!
    console.log(email)

    const template = new RegisterTemplate({
      pool: process.env.COGNITO_IDENTITY_NAME!,
      domain: process.env.COGNITO_IDENTITY_DOMAIN!,
      code: this.code.id
    })

    const body = await template.render()

    const stream = message.create({
      from: "you <scifish@gmail.com>",
      to: "someone <scifish@gmail.com>",
      subject: "template.subject()",
      text: body.text,
      attachment:
        [
          {
            data: body.html,
            alternative: true
          },
          {
            path: "templates/images/register.png",
            type: "image/png",
            headers: {
              "Content-ID": "<my-image>"
            }
          }
        ]
    }).stream()

    const msg = await new Promise<string>((resolve, reject) => {
      stream.on("end", resolve)
      stream.on("error", reject)
    })

    console.log(msg)
  }

  // /**
  //  * Compose a raw message using a template
  //  *
  //  * @return promise resolving with raw message
  //  */
  // protected async template(): Promise<MessageTemplate> {
  //   switch (this.code.context) {
  //     case "register":
  //       return new RegisterTemplate({
  //         project: process.env.PROJECT || "Terraform AWS Cognito Auth",
  //         domain: process.env.COGNITO_IDENTITY_DOMAIN!,
  //         code: this.code.id
  //       })
  //
  //     case "reset":
  //       return new ResetTemplate({
  //         project: process.env.PROJECT || "Terraform AWS Cognito Auth",
  //         domain: process.env.COGNITO_IDENTITY_DOMAIN!,
  //         code: this.code.id
  //       })
  //   }
  //
  //   // const text = await promisify(fs.readFile)(`templates/${this.code.context}/index.txt`, { encoding: "utf8" })
  //
  //   // const metadata = await promisify(readFile)(`templates/${this.code.context}/index.json`, { encoding: "utf8" })
  //
  //   console.log(html)
  //
  //   // const stream = message.create({
  //   //   from: "you <scifish@gmail.com>",
  //   //   to: "someone <scifish@gmail.com>",
  //   //   subject: "testing emailjs",
  //   //   text: "i hope this works",
  //   //   attachment:
  //   //     [
  //   //       {
  //   //         data: "<p>HTML message</p>",
  //   //         alternative: true
  //   //       },
  //   //       {
  //   //         path: "templates/images/register.png",
  //   //         type: "image/png",
  //   //         headers: {
  //   //           "Content-ID": "<my-image>"
  //   //         }
  //   //       }
  //   //     ]
  //   // }).stream()
  //   //
  //   // return new Promise<string>((resolve, reject) => {
  //   //   stream.on("end", resolve)
  //   //   stream.on("error", reject)
  //   // })
  //   return ""
  // }
}
