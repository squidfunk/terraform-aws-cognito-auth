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

import "dotenv/config"

import * as yargs from "yargs"

import { AuthenticationClient } from "../clients/authentication"
import { ManagementClient } from "../clients/management"

/* ----------------------------------------------------------------------------
 * Functions
 * ------------------------------------------------------------------------- */

/**
 * Helper function to print JSON data to console
 *
 * @param data - Data to print
 */
export function print(data: any) {
  // tslint:disable-next-line no-console
  console.log(JSON.stringify(data, undefined, 2))
}

/* ----------------------------------------------------------------------------
 * Program
 * ------------------------------------------------------------------------- */

/* Parse command line arguments */
yargs
  .locale("en")
  .usage("$0 [command] <options>", "Identity provider client")

  /* Help */
  .help("help")
  .alias("h", "help")

  /* Command: gx-access-client register --email --password */
  .command("register", "Register user with email address and password",
    y => y

    /* Usage and examples */
    .usage("$0 register [options]")
    .example("$0 register --email <email> --password <password>", "")

    /* Required: email address */
    .option("email", {
      describe: "Email address",
      type: "string",
      required: true
    })

    /* Required: password */
    .option("password", {
      describe: "Password",
      type: "string",
      required: true
    }),

    /* Execute command */
    async args => {
      const client = new AuthenticationClient()
      print(await client.register(args.email, args.password))
    })

  /* Command: gx-access-client verify --username */
  .command("verify", "Verify user",
    y => y

    /* Usage and examples */
    .usage("$0 verify [options]")
    .example("$0 verify --username <username>", "")

    /* Required: username or email */
    .option("username", {
      describe: "Username or email",
      type: "string",
      required: true
    }),

    /* Execute command */
    async args => {
      const client = new ManagementClient()
      await client.verifyUser(args.username)
    })

  /* Command: gx-access-client authenticate --username --password / --token */
  .command("authenticate", "Authenticate using credentials or refresh token",
    y => y

    /* Usage and examples */
    .usage("$0 authenticate [options]")
    .example("$0 authenticate --username <username> --password <password>", "")
    .example("$0 authenticate --token <refresh-token>", "")

    /* Required (1): username or email */
    .option("username", {
      describe: "Username or email",
      type: "string",
      implies: ["password"],
      conflicts: ["token"]
    })

    /* Required (1): password */
    .option("password", {
      describe: "Password",
      type: "string",
      implies: ["username"],
      conflicts: ["token"]
    })

    /* Required (2): refresh token */
    .option("token", {
      describe: "Refresh token",
      type: "string",
      conflicts: ["username", "password"]
    }),

    /* Execute command */
    async args => {
      const client = new AuthenticationClient()
      print(await client.authenticate(
        args.username || args.token, args.password))
    })

  /* Initialize yargs */
  .argv // tslint:disable-line no-unused-expression

// client forgot-password --username

// client admin-verify-user --username
// client admin-change-password --username --new-password
