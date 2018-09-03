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
// import { MemoryRouter } from "react-router"

// import { setRememberMeResultAction } from "providers/store/remember-me"
import {
  // LeaveSuccess,
  Render
} from "routes/Leave/LeaveSuccess"

// import {
//   mockFormSubmitPropsWithError,
//   mockFormSubmitPropsWithSuccess
// } from "_/mocks/enhancers"
// import { mockStore } from "_/mocks/providers"

/* ----------------------------------------------------------------------------
 * Tests
 * ------------------------------------------------------------------------- */

/* Sign out success component */
describe("components/LeaveSuccess", () => {

  /* Render component */
  describe("Render", () => {

    /* Test: should render with default props */
    it("should render with default props", () => {
      const wrapper = shallow(<Render />)
      expect(wrapper).toMatchSnapshot()
    })
  })

  // /* Enhanced component */
  // describe("LeaveSuccess", () => {

  //   /* Initialize store */
  //   const store = mockStore()

  //   /* Clear store */
  //   beforeEach(() => {
  //     store.clearActions()
  //   })

  //   // TODO: should dismiss notification in case of error

  //   /* Test: should render with default props */
  //   it("should render with default props", () => {
  //     const props = mockFormSubmitPropsWithSuccess()
  //     mount(
  //       <MemoryRouter>
  //         <LeaveSuccess {...props} />
  //       </MemoryRouter>, {
  //         context: { store },
  //         childContextTypes: {
  //           store: () => null
  //         }
  //       }
  //     )
  //     // expect(store.getActions().length).toEqual(2)
  //     // expect(store.getActions()[0])
  //     //   .toEqual(setRememberMeResultAction(false))
  //   })
  // })
})
