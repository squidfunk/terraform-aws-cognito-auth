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
  mount,
  shallow,
  StatelessComponent
} from "enzyme"
import * as React from "react"

import {
  FormRememberMe,
  Render,
  RenderProps
} from "components/FormRememberMe/FormRememberMe"
import { setRememberMeAction } from "providers/store/remember-me"

import { chance, search } from "_/helpers"
import { mockStore } from "_/mocks/providers"
import {
  mockChangeEventForCheckboxInput
} from "_/mocks/vendor/browser/events"

/* ----------------------------------------------------------------------------
 * Tests
 * ------------------------------------------------------------------------- */

/* Form remember me component */
describe("components/FormRememberMe", () => {

  /* Render component */
  describe("Render", () => {

    /* Default props */
    const props: RenderProps = {
      onChange: jest.fn(),
      handleChange: jest.fn()
    }

    /* Test: should render with default props */
    it("should render with default props", () => {
      const wrapper = shallow(
        <Render {...props}>
          __CHILDREN__
        </Render>
      )
      expect(wrapper).toMatchSnapshot()
    })

    /* Test: should render with additional checkbox props */
    it("should render with additional checkbox props", () => {
      const wrapper = shallow(
        <Render {...props} onBlur={jest.fn()}>
          __CHILDREN__
        </Render>
      )
      expect(wrapper).toMatchSnapshot()
    })
  })

  /* Enhanced component */
  describe("FormRememberMe", () => {

    /* Initialize store */
    const store = mockStore({
      remember: {
        active: false
      }
    })

    /* Clear store */
    beforeEach(() => {
      store.clearActions()
    })

    /* Test: should render with default props */
    it("should render with default props", () => {
      const wrapper = shallow(<FormRememberMe onChange={jest.fn()} />, {
        context: { store }
      })
      expect(search(wrapper, Render)).toMatchSnapshot()
    })

    /* { handleChange } */
    describe("{ handleChange }", () => {

      /* Mount component inside router */
      const wrapper = mount(
        <FormRememberMe onChange={jest.fn()} />, {
          context: { store }
        }
      )

      /* Form change handler */
      const handleChange = wrapper
        .find(Render as StatelessComponent<RenderProps>)
        .prop("handleChange")

      /* Test: should toggle remember me */
      it("should toggle remember me", () => {
        const options = {
          name: chance.string(),
          checked: true
        }
        handleChange(mockChangeEventForCheckboxInput(options), true)
        expect(store.getActions().length).toEqual(1)
        expect(store.getActions()[0])
          .toEqual(setRememberMeAction(true))
      })
    })
  })
})
