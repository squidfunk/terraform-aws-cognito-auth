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

import { Button, TextField } from "@material-ui/core"
import * as React from "react"

import { AuthenticateRequestWithCredentials } from "common/requests"

/* ----------------------------------------------------------------------------
 * Types
 * ------------------------------------------------------------------------- */

/**
 * Authentification form properties
 */
interface Props {
  handleSubmit: (data: AuthenticateRequestWithCredentials) => void
}

/**
 * Authentification form state
 */
type State = AuthenticateRequestWithCredentials

/* ----------------------------------------------------------------------------
 * Component
 * ------------------------------------------------------------------------- */

/**
 * Authentication form component
 */
export class AuthenticationForm extends React.Component<Props, State> {

  /**
   * Create component
   *
   * @param props - Properties
   */
  public constructor(props: Props) {
    super(props)

    /* Initialize state */
    this.state = {
      username: "",
      password: ""
    }
  }

  /**
   * Render component
   *
   * @return JSX element
   */
  public render() {
    const { username, password } = this.state
    return (
      <form method="post" onSubmit={ev => this.onSubmit(ev)}>
        <TextField name="username" type="text"
            label="Username" value={username}
            onChange={ev => this.onChange(ev)} />
        <br />
        <TextField name="password" type="password"
            label="Password" value={password}
            onChange={ev => this.onChange(ev)} />
        <br />
        <Button variant="flat" type="submit">Login</Button>
      </form>
    )
  }

  /**
   * Form change handler
   *
   * @param ev - Form event
   */
  protected onChange(ev: React.FormEvent<HTMLInputElement>) {
    const { name, value } = ev.currentTarget
    this.setState({ ...this.state, [name]: value })
  }

  /**
   * Form submit handler
   *
   * @param ev - Form event
   */
  protected onSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault()
    this.props.handleSubmit(this.state)
  }
}
