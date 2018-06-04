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

import { CognitoUserPoolTriggerEvent } from "aws-lambda"

import { chance } from "_/helpers"

/* ----------------------------------------------------------------------------
 * Data
 * ------------------------------------------------------------------------- */

/**
 * Mock API Gateway event
 *
 * @return API Gateway event
 */
export function mockCognitoUserPoolTriggerEvent(): CognitoUserPoolTriggerEvent {
  return {
    version: 1,
    region: chance.string(),
    userPoolId: chance.string(),
    userName: chance.guid(),
    callerContext: {
      awsSdkVersion: chance.string(),
      clientId: chance.string()
    },
    triggerSource: "PreSignUp_SignUp",
    request: {
      userAttributes: {
        email: chance.email()
      }
    },
    response: {
      autoConfirmUser: false
    }
  }
}
