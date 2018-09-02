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
import { MemoryRouter } from "react-router"

import {
  Render,
  RenderProps,
  TextLink
} from "components/TextLink/TextLink"

import { search } from "_/helpers"
import { mockStore } from "_/mocks/providers"

/* ----------------------------------------------------------------------------
 * Tests
 * ------------------------------------------------------------------------- */

/* Text link component */
describe("components/TextLink", () => {

  /* Render component */
  describe("Render", () => {

    /* Default props */
    const props: RenderProps = {
      to: "__TO__",
      classes: {
        root: "__ROOT__"
      },
      handleClickCapture: jest.fn()
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

    /* Test: should render with additional link props */
    it("should render with additional link props", () => {
      const wrapper = shallow(
        <Render {...props} onBlur={jest.fn()}>
          __CHILDREN__
        </Render>
      )
      expect(wrapper).toMatchSnapshot()
    })
  })

  /* Enhanced component */
  describe("TextLink", () => {

    /* Initialize store */
    const store = mockStore()

    /* Clear store */
    beforeEach(() => {
      store.clearActions()
    })

    /* Test: should render with default props */
    it("should render with default props", () => {
      const wrapper = shallow(
        <MemoryRouter>
          <TextLink to="__TO__">
            __CHILDREN__
          </TextLink>
        </MemoryRouter>, {
          context: { store }
        }
      )
      expect(search(wrapper, Render)).toMatchSnapshot()
    })

    /* { handleClickCapture } */
    describe("{ handleClickCapture }", () => {

      /* Mount component inside router */
      const wrapper = mount(
        <MemoryRouter>
          <TextLink to="__TO__">
            __CHILDREN__
          </TextLink>
        </MemoryRouter>, {
          context: { store },
          childContextTypes: {
            store: () => null
          }
        }
      )

      /* Link click capture handler */
      const handleClickCapture = wrapper
        .find(Render as StatelessComponent<RenderProps>)
        .prop("handleClickCapture")

      /* Test: should dismiss notification */
      it("should dismiss notification", () => {
        handleClickCapture()
        expect(store.getActions()).toMatchSnapshot()
      })
    })
  })
})
