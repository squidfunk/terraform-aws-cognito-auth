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

import { mount, shallow } from "enzyme"
import * as React from "react"

import {
  Render,
  RenderProps,
  enhance
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

import { chance, find } from "_/helpers"
import { Placeholder } from "_/mocks/components"

/* ----------------------------------------------------------------------------
 * Tests
 * ------------------------------------------------------------------------- */

/* Application components */
describe("components/App", () => {

  /* Render component */
  describe("<Render />", () => {

    /* Render properties */
    const props: RenderProps = {
      classes: {
        root: chance.string()
      }
    }

    /* Test: should render switch */
    it("should render switch", () => {
      const wrapper = shallow(<Render {...props} />)
      const switch0 = find(wrapper, "Switch")
      expect(switch0.exists()).toBe(true)
    })

    /* with path '/' */
    describe("with path '/'", () => {

      /* Test: should render exact route */
      it("should render exact route", () => {
        const wrapper = shallow(<Render {...props} />)
        const route = find(wrapper, "[path='/']")
        expect(route.prop("exact")).toBe(true)
      })

      /* Test: should render <Authenticate /> / */
      it("should render <Authenticate />", () => {
        const wrapper = shallow(<Render {...props} />)
        const route = find(wrapper, "[path='/']")
        expect(route.prop("component")).toEqual(Authenticate)
      })
    })

    /* with path '/leave' */
    describe("with path '/leave'", () => {

      /* Test: should render exact route */
      it("should render exact route", () => {
        const wrapper = shallow(<Render {...props} />)
        const route = find(wrapper, "[path='/leave']")
        expect(route.prop("exact")).toBe(true)
      })

      /* Test: should render <Leave /> */
      it("should render <Leave />", () => {
        const wrapper = shallow(<Render {...props} />)
        const route = find(wrapper, "[path='/leave']")
        expect(route.prop("component")).toEqual(Leave)
      })
    })

    /* with path '/register' */
    describe("with path '/register'", () => {

      /* Test: should render exact route */
      it("should render exact route", () => {
        const wrapper = shallow(<Render {...props} />)
        const route = find(wrapper, "[path='/register']")
        expect(route.prop("exact")).toBe(true)
      })

      /* Test: should render <Register /> */
      it("should render <Register />", () => {
        const wrapper = shallow(<Render {...props} />)
        const route = find(wrapper, "[path='/register']")
        expect(route.prop("component")).toEqual(Register)
      })
    })

    /* with path '/register/:code' */
    describe("with path '/register/:code'", () => {

      /* Test: should render exact route */
      it("should render wildcard route", () => {
        const wrapper = shallow(<Render {...props} />)
        const route = find(wrapper, "[path='/register/:code+']")
        expect(route.prop("exact")).toBeUndefined()
      })

      /* Test: should render <RegisterVerification /> */
      it("should render <RegisterVerification />", () => {
        const wrapper = shallow(<Render {...props} />)
        const route = find(wrapper, "[path='/register/:code+']")
        expect(route.prop("component")).toEqual(RegisterVerification)
      })
    })

    /* with path '/reset' */
    describe("with path '/reset'", () => {

      /* Test: should render exact route */
      it("should render exact route", () => {
        const wrapper = shallow(<Render {...props} />)
        const route = find(wrapper, "[path='/reset']")
        expect(route.prop("exact")).toBe(true)
      })

      /* Test: should render <Reset /> */
      it("should render <Reset />", () => {
        const wrapper = shallow(<Render {...props} />)
        const route = find(wrapper, "[path='/reset']")
        expect(route.prop("component")).toEqual(Reset)
      })
    })

    /* with path '/reset/:code' */
    describe("with path '/reset/:code'", () => {

      /* Test: should render exact route */
      it("should render wildcard route", () => {
        const wrapper = shallow(<Render {...props} />)
        const route = find(wrapper, "[path='/reset/:code+']")
        expect(route.prop("exact")).toBeUndefined()
      })

      /* Test: should render <ResetVerification /> */
      it("should render <ResetVerification />", () => {
        const wrapper = shallow(<Render {...props} />)
        const route = find(wrapper, "[path='/reset/:code+']")
        expect(route.prop("component")).toEqual(ResetVerification)
      })
    })

    /* with catch all (not found) */
    describe("with catch all (not found)", () => {

      /* Test: should render exact route */
      it("should render catch-all route", () => {
        const wrapper = shallow(<Render {...props} />)
        const route = find(wrapper, "Route").last()
        expect(route.prop("path")).toBeUndefined()
        expect(route.prop("exact")).toBeUndefined()
      })

      /* Test: should render <NotFound /> */
      it("should render <NotFound />", () => {
        const wrapper = shallow(<Render {...props} />)
        const route = find(wrapper, "Route").last()
        expect(route.prop("component")).toEqual(NotFound)
      })
    })
  })

  /* Application component */
  describe("<App />", () => {

    /* Mount placeholder wrapped with enhancer */
    function mountPlaceholder() {
      const Component = enhance()(Placeholder)
      return mount(<Component />)
    }

    /* Test: should render with styles */
    it("should render with styles", () => {
      const wrapper = mountPlaceholder()
      expect(wrapper.find(Placeholder).prop("classes"))
        .toBeDefined()
    })

    /* Test: should render with display name */
    it("should render with display name", () => {
      const wrapper = mountPlaceholder()
      expect(wrapper.find(Placeholder).name())
        .toEqual("App")
    })
  })
})
