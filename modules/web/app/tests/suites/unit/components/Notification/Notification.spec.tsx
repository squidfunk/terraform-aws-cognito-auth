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
import { compose } from "recompose"

import {
  enhance,
  Render,
  RenderProps
} from "components/Notification/Notification"
import { withNotification } from "enhancers"

import { chance, find } from "_/helpers"
import { Placeholder } from "_/mocks/components"
import { mockWithNotification } from "_/mocks/enhancers"
import { mockNotificationDataWithSuccess } from "_/mocks/providers"

/* ----------------------------------------------------------------------------
 * Tests
 * ------------------------------------------------------------------------- */

/* Notification components */
describe("components/Notification", () => {

  /* Render component */
  describe("<Render />", () => {

    /* Render properties */
    const props: RenderProps = {
      classes: {
        root: chance.string(),
        success: chance.string(),
        error: chance.string()
      },
      notification: {
        show: false
      }
    }

    /* Test: should render collapsed */
    it("should render collapsed", () => {
      const wrapper = shallow(<Render {...props} />)
      // console.log(wrapper.dive().debug())
      // TODO: the problem is, that ForwardRef(Collapse) is not matched
      // however, some components contain forward refs, some don't.
      const collapse = find(wrapper, "Collapse")
      expect(collapse.prop("in")).toBe(false)
    })

    /* with visibility */
    describe("with visibilility", () => {

      /* Additional render properties */
      const addon: Partial<RenderProps> = {
        notification: {
          show: true
        }
      }

      /* Test: should render collapsed */
      it("should render collapsed", () => {
        const wrapper = shallow(<Render {...props} {...addon} />)
        expect(find(wrapper, "Fade")).toBeUndefined()
        expect(find(wrapper, "Typography")).toBeUndefined()
      })
    })

    /* with visibility and message */
    describe("with visibilility and message", () => {

      /* Additional render properties */
      const addon: Partial<RenderProps> = {
        notification: {
          show: true,
          data: mockNotificationDataWithSuccess()
        }
      }

      /* Test: should render expanded */
      it("should render expanded", () => {
        const wrapper = shallow(<Render {...props} {...addon} />)
        const fade = find(wrapper, "Fade")
        expect(fade.exists()).toBe(true)
      })
    })
  })

  /* Notification component */
  describe("<Notification />", () => {

    /* Mount placeholder wrapped with enhancer */
    function mountPlaceholder() {
      const Component = compose(
        withNotification(),
        enhance()
      )(Placeholder)
      return mount(<Component />)
    }

    /* Mock enhancers */
    beforeEach(() => {
      mockWithNotification()
    })

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
        .toEqual("Notification")
    })
  })
})
