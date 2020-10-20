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

import * as parser from "body-parser"
import { Router } from "express"
import * as glob from "glob"
import * as normalize from "header-case-normalizer"
import * as path from "path"

import { mockAPIGatewayProxyEvent } from "_/mocks/vendor/aws-lambda"

/* ----------------------------------------------------------------------------
 * Functions
 * ------------------------------------------------------------------------- */

/**
 * Express-based, API Gateway-like Lambda middleware
 *
 * Never, never, never use this in production - only for development.
 *
 * @return Connect-compatible middleware
 */
export async function middleware() {
  const router = Router()
  router.use(parser.json())

  /* Mount Lambda handlers as endpoints */
  const base = path.resolve(__dirname, "../../../src/handlers")
  await Promise.all(glob.sync(path.resolve(base, "!(_)/**/*.ts"))
    .map(async file => {

      /* Load handler and normalize name */
      const handlers = await import(file)
      const name = path.dirname(path.relative(base, file))
        .replace("verify", ":code")

      /* Mount handlers for each method */
      Object.keys(handlers).forEach(method => {
        const handler = handlers[method]
        router[method as "get" | "post"](`/${name}`, async (req, res) => {

          /* Normalize header case */
          const normalizedHeaders = Object.keys(req.headers)
            .reduce<{ [name: string]: string }>((result, header) => {
              result[normalize(header)] = req.headers[header] as string
              return result
            }, {})

          /* Mock API Gateway event */
          const event = mockAPIGatewayProxyEvent({
            path: req.url,
            pathParameters: req.params,
            headers: normalizedHeaders,
            method: req.method as "GET" | "POST",
            body: JSON.stringify(req.body)
          })

          /* Artificial delay to simulate network behavior */
          await new Promise(resolve => setTimeout(resolve, 100))

          /* Invoke handler and transform response */
          try {
            const { statusCode, headers, body } = await handler(event)
            res.statusCode = statusCode
            res.set(headers || {})
            res.end(body)

          /* Terminate with 500, as Express should behave like API Gateway */
          } catch (err) {
            res.statusCode = 500
            res.end()
          }
        })
      })
    }))

  /* Return connect-compatible middleware */
  return router
}
