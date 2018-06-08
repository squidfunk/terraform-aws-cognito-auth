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

import { APIGatewayEvent } from "aws-lambda"

import { chance } from "_/helpers"

/* ----------------------------------------------------------------------------
 * Data
 * ------------------------------------------------------------------------- */

/**
 * Mock API Gateway event path parameters
 *
 * @param number - Number of path parameters
 *
 * @return API Gateway event path parameters
 */
export function mockAPIGatewayEventPathParameters(
  count: number = chance.integer({ min: 0, max: 2 })
) {
  return [...Array(count)].reduce(params => {
    return { ...params, [chance.string()]: chance.string() }
  }, {})
}

/**
 * Mock API Gateway event
 *
 * @param method - HTTP method
 * @param path - Request payload
 * @param params - Path parameters
 *
 * @return API Gateway event
 */
function mockAPIGatewayEvent(
  method: "GET" | "POST", body: any = "", params: {
    [name: string]: string
  } = mockAPIGatewayEventPathParameters()
): APIGatewayEvent {
  return {
    resource: "/",
    path: "/",
    httpMethod: method,
    headers: {
      "Host": chance.url(),
      "Referer": chance.url(),
      "User-Agent": chance.string()
    },
    queryStringParameters: null,
    pathParameters: params,
    requestContext: {
      accountId: chance.string(),
      apiId: chance.string(),
      httpMethod: "POST",
      requestId: chance.guid(),
      requestTimeEpoch: chance.timestamp() * 1000 + chance.millisecond(),
      resourceId: chance.string(),
      resourcePath: "/",
      stage: chance.string(),
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
      }
    },
    stageVariables: null,
    body: typeof body !== "string" ? JSON.stringify(body) : body,
    isBase64Encoded: chance.bool()
  }
}

/**
 * Mock API Gateway GET event
 *
 * @param body - Request payload
 * @param params - Path parameters
 *
 * @return API Gateway event
 */
export function mockAPIGatewayEventHttpGet(
  body: any = "", params: {
    [name: string]: string
  } = mockAPIGatewayEventPathParameters()
): APIGatewayEvent {
  return mockAPIGatewayEvent("GET", body, params)
}

/**
 * Mock API Gateway POST event
 *
 * @param body - Request payload
 * @param params - Path parameters
 *
 * @return API Gateway event
 */
export function mockAPIGatewayEventHttpPost(
  body: any = "", params: {
    [name: string]: string
  } = mockAPIGatewayEventPathParameters()
): APIGatewayEvent {
  return mockAPIGatewayEvent("POST", body, params)
}
