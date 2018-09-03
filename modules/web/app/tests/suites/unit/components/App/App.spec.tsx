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

import { shallow } from "enzyme"
import * as React from "react"
import { RouteProps } from "react-router-dom"

import {
  enhance,
  Render,
  RenderProps
} from "components/App/App"
import {
  Authenticate,
  Leave,
  NotFound,
  Register,
  RegisterVerification,
  Reset,
  ResetVerification
} from "routes"

import { chance, search } from "_/helpers"

/* ----------------------------------------------------------------------------
 * Tests
 * ------------------------------------------------------------------------- */

/* App component */
describe("components/App", () => {

  /* Render component */
  describe("<Render />", () => {

    /* Shallow-render component */
    const wrapper = shallow(<Render classes={{ root: chance.string() }} />)

    /* Test: should render switch */
    it("should render switch", () => {
      expect(search(wrapper, "Switch").exists()).toBe(true)
    })

    /* with path / */
    describe("with path /", () => {

      /* Route and props */
      const route = search(wrapper, `[path="/"]`)
      const props: RouteProps = route.props()

      /* Test: should render exact route */
      it("should render exact route", () => {
        expect(route.is("Route")).toBe(true)
        expect(props.exact).toBe(true)
      })

      /* Test: should link to authentication / */
      it("should link to authentication", () => {
        expect(props.component).toEqual(Authenticate)
      })
    })

    /* with path / */
    describe("with path /leave", () => {

      /* Route and props */
      const route = search(wrapper, `[path="/leave"]`)
      const props: RouteProps = route.props()

      /* Test: should render exact route */
      it("should render exact route", () => {
        expect(route.is("Route")).toBe(true)
        expect(props.exact).toBe(true)
      })

      /* Test: should link to sign out / */
      it("should link to sign out", () => {
        expect(props.component).toEqual(Leave)
      })
    })

    /* with path /register */
    describe("with path /register", () => {

      /* Route and props */
      const route = search(wrapper, `[path="/register"]`)
      const props: RouteProps = route.props()

      /* Test: should render exact route */
      it("should render exact route", () => {
        expect(route.is("Route")).toBe(true)
        expect(props.exact).toBe(true)
      })

      /* Test: should link to registration / */
      it("should link to registration", () => {
        expect(props.component).toEqual(Register)
      })
    })

    /* with path /register/:code */
    describe("with path /register/:code", () => {

      /* Route and props */
      const route = search(wrapper, `[path="/register/:code+"]`)
      const props: RouteProps = route.props()

      /* Test: should render wildcard route */
      it("should render wildcard route", () => {
        expect(route.is("Route")).toBe(true)
        expect(props.exact).toBeFalsy()
      })

      /* Test: should link to registration / */
      it("should link to registration verification", () => {
        expect(props.component).toEqual(RegisterVerification)
      })
    })

    /* with path /reset */
    describe("with path /reset", () => {

      /* Route and props */
      const route = search(wrapper, `[path="/reset"]`)
      const props: RouteProps = route.props()

      /* Test: should render exact route */
      it("should render exact route", () => {
        expect(route.is("Route")).toBe(true)
        expect(props.exact).toBe(true)
      })

      /* Test: should link to password reset / */
      it("should link to password reset", () => {
        expect(props.component).toEqual(Reset)
      })
    })

    /* with path /reset/:code */
    describe("with path /reset/:code", () => {

      /* Route and props */
      const route = search(wrapper, `[path="/reset/:code+"]`)
      const props: RouteProps = route.props()

      /* Test: should render wildcard route */
      it("should render wildcard route", () => {
        expect(route.is("Route")).toBe(true)
        expect(props.exact).toBeFalsy()
      })

      /* Test: should link to password reset / */
      it("should link to password reset verification", () => {
        expect(props.component).toEqual(ResetVerification)
      })
    })

    /* with catch all (not found) */
    describe("with catch all (not found)", () => {

      /* Route and props */
      const route = search(wrapper, "Route").last()
      const props: RouteProps = route.props()

      /* Test: should render catch-all route */
      it("should render catch-all route", () => {
        expect(route.is("Route")).toBe(true)
        expect(props.path).toBeFalsy()
        expect(props.exact).toBeFalsy()
      })

      /* Test: should link to page not found / */
      it("should link to page not found", () => {
        expect(props.component).toEqual(NotFound)
      })
    })
  })

  /* Application */
  describe("<App />", () => {

    /* Enhance component */
    const App = enhance()(Render)

    /* Test: should render with styles */
    it("should render with styles", () => {
      const wrapper = shallow(<App />)
      const component = search(wrapper, Render)
      expect(component.prop<RenderProps>("classes")).toBeDefined()
    })

    /* Test: should render with display name */
    it("should render with display name", () => {
      const wrapper = shallow(<App />)
      const component = search(wrapper, Render)
      expect(component.name()).toEqual("App")
    })
  })
})
