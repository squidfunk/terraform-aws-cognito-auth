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

import { RegisterRequest } from "common/requests"

/* ----------------------------------------------------------------------------
 * Types
 * ------------------------------------------------------------------------- */

/**
 * Registration form properties
 */
interface Props {
  handleSubmit: (data: RegisterRequest) => void
}

/**
 * Registration form state
 */
type State = RegisterRequest

/* ----------------------------------------------------------------------------
 * Component
 * ------------------------------------------------------------------------- */

/**
 * Registration form component
 */
export class RegistrationForm extends React.Component<Props, State> {

  /**
   * Create component
   *
   * @param props - Properties
   */
  public constructor(props: Props) {
    super(props)

    /* Initialize state */
    this.state = {
      email: "",
      password: ""
    }
  }

  /**
   * Render component
   *
   * @return JSX element
   */
  public render() {
    const { email, password } = this.state
    return (
      <form method="post" onSubmit={ev => this.onSubmit(ev)}>
        <TextField name="email" type="email"
            label="Email" value={email}
            onChange={ev => this.onChange(ev)} />
        <br />
        <TextField name="password" type="password"
            label="Password" value={password}
            onChange={ev => this.onChange(ev)} />
        <br />
        <Button variant="flat" type="submit">Register</Button>
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
