/*
 * Copyright (c) 2018 Martin Donath <martin.donath@squidfunk.com>
 *
 * All rights reserved. No part of this computer program(s) may be used,
 * reproduced, stored in any retrieval system, or transmitted, in any form or
 * by any means, electronic, mechanical, photocopying, recording, or otherwise
 * without prior written permission.
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

import { trigger } from "~/index"

import {
  mockCognitoUserPoolTriggerEvent
} from "_/mocks/vendor/aws-lambda"
import {
  mockCognitoIdentityServiceProviderListUsersWithError,
  mockCognitoIdentityServiceProviderListUsersWithoutResult,
  mockCognitoIdentityServiceProviderListUsersWithResult
} from "_/mocks/vendor/aws-sdk"

/* ----------------------------------------------------------------------------
 * Tests
 * ------------------------------------------------------------------------- */

/* Lambda trigger */
describe("trigger", () => {

  /* Cognito user pool trigger event */
  const event = mockCognitoUserPoolTriggerEvent()

  /* Test: should resolve with input event */
  it("should resolve with input event", async () => {
    const listUsersMock =
      mockCognitoIdentityServiceProviderListUsersWithoutResult()
    expect(await trigger(event)).toEqual(event)
    expect(listUsersMock).toHaveBeenCalledWith({
      UserPoolId: event.userPoolId,
      Filter: `email="${event.request.userAttributes.email}"`
    })
  })

  /* Test: should reject on retrieve error */
  it("should reject on retrieve error", async done => {
    mockCognitoIdentityServiceProviderListUsersWithError()
    try {
      await trigger(event)
      done.fail()
    } catch (err) {
      expect(err).toEqual(jasmine.any(Error))
      done()
    }
  })

  /* Test: should reject on already registered email address */
  it("should reject on already registered email address", async done => {
    mockCognitoIdentityServiceProviderListUsersWithResult()
    try {
      await trigger(event)
      done.fail()
    } catch (err) {
      expect(err).toEqual(new Error("Email address already registered"))
      done()
    }
  })
})
