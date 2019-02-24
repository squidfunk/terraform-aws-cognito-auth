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

import { APIGatewayProxyEvent } from "aws-lambda"

import { chance } from "_/helpers"

/* ----------------------------------------------------------------------------
 * Types
 * ------------------------------------------------------------------------- */

/**
 * API Gateway event mock options
 *
 * @template TParameters - Event path parameter type
 * @template TEvent - Event body type
 */
interface APIGatewayProxyEventOptions<
  TParameters extends {}, TEvent extends {}
> {
  path: string                         /* Event path */
  pathParameters: TParameters          /* Event path parameters */
  method: "GET" | "POST"               /* Event HTTP method */
  headers: {                           /* Event headers */
    [name: string]: string
  }
  body: TEvent | string                /* Event body */
}

/* ----------------------------------------------------------------------------
 * Data
 * ------------------------------------------------------------------------- */

/**
 * Mock path parameters for `APIGatewayProxyEvent`
 *
 * @param number - Number of path parameters
 *
 * @return API Gateway event path parameters
 */
export function mockAPIGatewayProxyEventPathParameters(
  count: number = chance.integer({ min: 0, max: 2 })
) {
  return [...Array(count)].reduce(params => {
    return { ...params, [chance.string()]: chance.string() }
  }, {})
}

/**
 * Mock `APIGatewayProxyEventOptions`
 *
 * @template TParameters - Event path parameter type
 * @template TEvent - Event body type
 *
 * @param options - Event option overrides
 *
 * @return API Gateway event options
 */
export function mockAPIGatewayProxyEventOptions<
  TParameters extends {}, TEvent extends {}
>(
  override?: Partial<APIGatewayProxyEventOptions<TParameters, TEvent>>
): APIGatewayProxyEventOptions<TParameters, TEvent> {
  return {
    path: "/",
    pathParameters: mockAPIGatewayProxyEventPathParameters(),
    method: "POST",
    body: "",
    ...override,
    headers: {
      "Host": chance.url(),
      "Referer": chance.url(),
      "User-Agent": chance.string(),
      ...(override ? override.headers : {})
    }
  }
}

/**
 * Mock `APIGatewayProxyEvent`
 *
 * @template TParameters - Event path parameter type
 * @template TEvent - Event body type
 *
 * @param options - Event option overrides
 *
 * @return API Gateway event
 */
export function mockAPIGatewayProxyEvent<TEvent extends {}>(
  override?: Partial<APIGatewayProxyEventOptions<{}, TEvent>>
): APIGatewayProxyEvent
export function mockAPIGatewayProxyEvent<
  TParameters extends {}, TEvent extends {}
>(
  override?: Partial<APIGatewayProxyEventOptions<TParameters, TEvent>>
): APIGatewayProxyEvent
export function mockAPIGatewayProxyEvent<
  TParameters extends {}, TEvent extends {}
>(
  override?: Partial<APIGatewayProxyEventOptions<TParameters, TEvent>>
): APIGatewayProxyEvent {
  const options = mockAPIGatewayProxyEventOptions<TParameters, TEvent>(override)
  const body = typeof options.body !== "string"
    ? JSON.stringify(options.body)
    : options.body
  return {
    resource: "/",
    path: options.path,
    httpMethod: options.method,
    headers: options.headers,
    queryStringParameters: null,
    pathParameters: options.pathParameters,
    requestContext: {
      accountId: chance.string(),
      apiId: chance.string(),
      connectedAt: chance.integer(),
      httpMethod: "POST",
      requestId: chance.guid(),
      requestTimeEpoch: chance.timestamp() * 1000 + chance.millisecond(),
      resourceId: chance.string(),
      resourcePath: "/",
      identity: {
        accountId: null,
        apiKey: chance.string(),
        apiKeyId: chance.string(),
        accessKey: null,
        caller: null,
        cognitoAuthenticationProvider: null,
        cognitoAuthenticationType: null,
        cognitoIdentityId: null,
        cognitoIdentityPoolId: null,
        sourceIp: chance.ip(),
        user: null,
        userAgent: chance.string(),
        userArn: null
      },
      path: options.path,
      stage: chance.string()
    },
    multiValueHeaders: {},
    multiValueQueryStringParameters: null,
    stageVariables: null,
    body,
    isBase64Encoded: chance.bool()
  }
}
