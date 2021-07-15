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

import { mount } from "enzyme"
import * as React from "react"

import { withCallback } from "enhancers"

import { mockSession } from "_/mocks/common"
import { Placeholder } from "_/mocks/components"
import { mockLocationAssign } from "_/mocks/vendor/browser/location"

/* ----------------------------------------------------------------------------
 * Tests
 * ------------------------------------------------------------------------- */

/* Callback enhancer */
xdescribe("enhancers/with-focallbackrm", () => {

  /* Mount placeholder wrapped with enhancer */
  function mountPlaceholder() {
    const Component = withCallback()(Placeholder)
    return mount(<Component />)
  }

  /* withCallback */
  describe("withCallback", () => {

    /* { callback } */
    describe("{ callback }", () => {

      /* Session */
      const session = mockSession(true)

      /* Test: should redirect to application origin */
      it("should redirect to application origin", () => {
        const assignMock = mockLocationAssign()
        const wrapper = mountPlaceholder()
        const callback = wrapper.find(Placeholder).prop("callback")
        callback(session.id)
        expect(assignMock).toHaveBeenCalledWith(
          jasmine.stringMatching(`//${window.env.APP_ORIGIN}/`)
        )
      })

      /* Test: should redirect with identity token */
      it("should redirect with identity token", () => {
        const assignMock = mockLocationAssign()
        const wrapper = mountPlaceholder()
        const callback = wrapper.find(Placeholder).prop("callback")
        callback(session.id)
        expect(assignMock).toHaveBeenCalledWith(
          jasmine.stringMatching(
            `#token=${session.id.token}&expires=${session.id.expires}`
          ))
      })
    })
  })
})
