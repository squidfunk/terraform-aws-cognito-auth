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

import {
  APIGatewayEvent,
  APIGatewayProxyResult
} from "aws-lambda"

import { AuthenticationClient } from "./clients/authentication"
import { ManagementClient } from "./clients/management"
// import { SessionClient } from "./clients/session"
import { VerificationProvider } from "./verification"

// tslint:disable no-empty no-duplicate-string

/* ----------------------------------------------------------------------------
 * Handlers
 * ------------------------------------------------------------------------- */

/**
 * Authenticate using credentials or refresh token
 *
 * @param event - API Gateway event
 *
 * @return Promise resolving with HTTP response
 */
export async function register(
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> {
  const data = JSON.parse(event.body!)

  /* Initialize client and perform authentication */
  const client = AuthenticationClient.factory()
  const code = await client.register(data.email, data.password)

  /* Always return with 202 (Accepted) and add CORS headers, as we use the
     Lambda Proxy integration which doesn't add them upon invocation */
  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": process.env.ACCESS_CONTROL_ORIGIN!
    },
    body: JSON.stringify(code)
  }
}

/**
 * Authenticate using credentials or refresh token
 *
 * @param event - API Gateway event
 *
 * @return Promise resolving with HTTP response
 */
export async function registerVerify(
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> {
  const verification = new VerificationProvider()
  const code = await verification.claim(event.pathParameters!.token)

  /* Initialize client and perform authentication */
  const client = ManagementClient.factory()
  await client.verifyUser(code.subject)

  /* Always return with 202 (Accepted) and add CORS headers, as we use the      // OR 404
     Lambda Proxy integration which doesn't add them upon invocation */
  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": process.env.ACCESS_CONTROL_ORIGIN!
    },
    body: JSON.stringify(code)
  }
}

/**
 * Authenticate using credentials or refresh token
 *
 * @param event - API Gateway event
 *
 * @return Promise resolving with HTTP response
 */
export async function reset(
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> {
  const data = JSON.parse(event.body!)

  /* Initialize client and perform authentication */
  const client = AuthenticationClient.factory()
  const code = await client.forgotPassword(data.username)

  /* Always return with 202 (Accepted) and add CORS headers, as we use the
     Lambda Proxy integration which doesn't add them upon invocation */
  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": process.env.ACCESS_CONTROL_ORIGIN!
    },
    body: JSON.stringify(code)
  }
}

/**
 * Authenticate using credentials or refresh token
 *
 * @param event - API Gateway event
 *
 * @return Promise resolving with HTTP response
 */
export async function resetVerify(
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> {
  const data = JSON.parse(event.body!)

  const verification = new VerificationProvider()
  const code = await verification.claim(event.pathParameters!.token)

  /* Initialize client and perform authentication */
  const client = ManagementClient.factory()
  await client.changePassword(code.subject, data.password)

  /* Always return with 202 (Accepted) and add CORS headers, as we use the      // OR 404
     Lambda Proxy integration which doesn't add them upon invocation */
  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": process.env.ACCESS_CONTROL_ORIGIN!
    },
    body: JSON.stringify(code)
  }
}

/**
 * Authenticate using credentials or refresh token
 *
 * @param event - API Gateway event
 *
 * @return Promise resolving with HTTP response
 */
export async function authenticate(
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> {
  const data = JSON.parse(event.body!)

  /* Initialize client and perform authentication */
  const client = AuthenticationClient.factory()
  const session = await client.authenticate(data.username || data.token, data.password)

  /* Always return with 202 (Accepted) and add CORS headers, as we use the
     Lambda Proxy integration which doesn't add them upon invocation */
  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": process.env.ACCESS_CONTROL_ORIGIN!
    },
    body: JSON.stringify(session)
  }
}
