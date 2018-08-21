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

import * as path from "path"

import {
  Config as KarmaConfig,
  ConfigOptions as KarmaConfigOptions
} from "karma"
import {
  Configuration as WebpackConfig,
  Rule as WebpackRule
} from "webpack"

/* ----------------------------------------------------------------------------
 * Plugins
 * ------------------------------------------------------------------------- */

// import EventHooksPlugin = require("event-hooks-webpack-plugin")

/* ----------------------------------------------------------------------------
 * Functions
 * ------------------------------------------------------------------------- */

/**
 * Webpack configuration
 *
 * @param config - Configuration
 *
 * @return Webpack configuration
 */
export function webpack(
  config: KarmaConfig & KarmaConfigOptions
): Partial<WebpackConfig> {
  return {
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: ["babel-loader", "ts-loader"],
          exclude: /\/node_modules\//
        },
        ...(config.singleRun
          ? [
              ({
                test: /\.ts$/,
                use: "istanbul-instrumenter-loader?+esModules",
                include: path.resolve(__dirname, "../../src"),
                enforce: "post"
              }) as WebpackRule
            ]
          : [])
      ]
    },
    resolve: {
      modules: [
        path.resolve(__dirname, "../../node_modules")
      ],
      extensions: [".ts", ".js"],
      alias: {
        "~": path.resolve(__dirname, "../../src"),
        "_": path.resolve(__dirname, "..")
      }
    },
    plugins: [

      /* Hack: The webpack development middleware sometimes goes into a loop
         on macOS when starting for the first time. This is a quick fix until
         this issue is resolved. See: http://bit.ly/2AsizEn */
      // new EventHooksPlugin({
      //   "watch-run": (compiler: any, done: () => {}) => {
      //     compiler.startTime += 10000
      //     done()
      //   },
      //   "done": (stats: any) => {
      //     stats.startTime -= 10000
      //   }
      // })
    ],
    devtool: "source-map"
  }
}
