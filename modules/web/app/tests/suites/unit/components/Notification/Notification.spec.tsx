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

import {
  Notification,
  Render,
  RenderProps
} from "components/Notification/Notification"
import {
  NotificationData,
  NotificationType
} from "providers/store/notification"

import { search } from "_/helpers"
import { mockStore } from "_/mocks/providers"

/* ----------------------------------------------------------------------------
 * Tests
 * ------------------------------------------------------------------------- */

/* Notification component */
describe("components/Notification", () => {

  /* Render component */
  describe("Render", () => {

    /* Default props */
    const props: RenderProps = {
      classes: {
        root: "__ROOT__",
        success: "__SUCCESS__",
        error: "__ERROR__"
      },
      notification: {
        show: false
      }
    }

    /* Test: should render collapsed if not visible */
    it("should render collapsed if not visible", () => {
      const wrapper = shallow(<Render {...props} />)
      expect(wrapper).toMatchSnapshot()
    })

    /* Test: should render collapsed if message is missing */
    it("should render collapsed if message is missing", () => {
      const wrapper = shallow(
        <Render {...props} notification={{ show: true }} />
      )
      expect(wrapper).toMatchSnapshot()
    })

    /* Test: should render expanded for success message */
    it("should render expanded for success message", () => {
      const data: NotificationData = {
        type: NotificationType.SUCCESS,
        message: "__MESSAGE__"
      }
      const wrapper = shallow(
        <Render {...props} notification={{ ...props.notification, data }} />
      )
      expect(wrapper).toMatchSnapshot()
    })

    /* Test: should render expanded for error message */
    it("should render expanded for error message", () => {
      const data: NotificationData = {
        type: NotificationType.ERROR,
        message: "__MESSAGE__"
      }
      const wrapper = shallow(
        <Render {...props} notification={{ ...props.notification, data }} />
      )
      expect(wrapper).toMatchSnapshot()
    })
  })

  /* Enhanced component */
  describe("Notification", () => {

    /* Initialize store */
    const store = mockStore({
      notification: {
        data: {
          type: NotificationType.ERROR,
          message: "__MESSAGE__"
        },
        show: true
      }
    })

    /* Clear store */
    beforeEach(() => {
      store.clearActions()
    })

    /* Test: should render with default props */
    it("should render with default props", () => {
      const wrapper = shallow(<Notification />, {
        context: { store }
      })
      expect(search(wrapper, Render)).toMatchSnapshot()
    })
  })
})
