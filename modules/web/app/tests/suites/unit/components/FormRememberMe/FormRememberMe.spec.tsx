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

import { mount, shallow } from "enzyme"
import * as React from "react"

import {
  enhance,
  FormRememberMeProps,
  Render,
  RenderProps
} from "components/FormRememberMe/FormRememberMe"

import { chance, find } from "_/helpers"
import { Placeholder } from "_/mocks/components"
import { mockWithRememberMe } from "_/mocks/enhancers"
import { mockChangeEventForCheckboxInput } from "_/mocks/vendor/browser/events"

/* ----------------------------------------------------------------------------
 * Tests
 * ------------------------------------------------------------------------- */

/* Form remember me components */
describe("components/FormRememberMe", () => {

  /* Render component */
  describe("<Render />", () => {

    /* Render properties */
    const props: RenderProps = {
      onChange: jest.fn(),
      handleChange: jest.fn()
    }

    /* Test: should render checkbox */
    it("should render checkbox", () => {
      const wrapper = shallow(<Render {...props} />)
      const input = find(wrapper, "Checkbox")
      expect(input.exists()).toBe(true)
    })

    /* Test: should render checkbox with change handler */
    it("should render checkbox with change handler", () => {
      const wrapper = shallow(<Render {...props} />)
      const input = find(wrapper, "Checkbox")
      expect(input.prop("onChange")).toEqual(props.handleChange)
    })
  })

  /* Form remember me component */
  describe("<FormRememberMe />", () => {

    /* Mount placeholder wrapped with enhancer */
    function mountPlaceholder(_: FormRememberMeProps) {
      const Component = enhance()(Placeholder)
      return mount(<Component {..._} />)
    }

    /* Component properties */
    const props: FormRememberMeProps = {
      onChange: jest.fn()
    }

    /* Mock enhancers */
    beforeEach(() => {
      mockWithRememberMe()
    })

    /* Test: should render with display name */
    it("should render with display name", () => {
      const wrapper = mountPlaceholder(props)
      expect(wrapper.find(Placeholder).name())
        .toEqual("FormRememberMe")
    })

    /* { handleChange } */
    describe("{ handleChange }", () => {

      /* Test: should toggle remember me */
      it("should invoke change handler", () => {
        const wrapper = mountPlaceholder(props)
        const handleChange = wrapper.find(Placeholder).prop("handleChange")
        const options = { name: chance.string(), checked: chance.bool() }
        const ev = mockChangeEventForCheckboxInput(options)
        handleChange(ev, options.checked)
        wrapper.update()
        expect(wrapper.find(Placeholder).prop("onChange"))
          .toHaveBeenCalledWith(ev, options.checked)
      })
    })
  })
})
