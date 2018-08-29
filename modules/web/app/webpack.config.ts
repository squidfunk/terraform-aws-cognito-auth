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

import * as dotenv from "dotenv"
import { Application } from "express"
import * as HtmlPlugin from "html-webpack-plugin"
import * as proxy from "http-proxy-middleware"
import * as path from "path"
import { TsconfigPathsPlugin } from "tsconfig-paths-webpack-plugin"
import {
  Configuration,
  NoEmitOnErrorsPlugin
} from "webpack"

/* ----------------------------------------------------------------------------
 * Configuration
 * ------------------------------------------------------------------------- */

/**
 * Webpack configuration
 *
 * @param env - Webpack environment arguments
 * @param args - Command-line arguments
 *
 * @return Webpack configuration
 */
export default (_env: never, args: Configuration) => {
  const { parsed: env } = dotenv.config()
  const config: Configuration = {
    mode: args.mode,

    /* Entrypoint */
    entry: ["src"],

    /* Loaders */
    module: {
      rules: [

        /* TypeScript */
        {
          test: /\.tsx?$/,
          use: [
            "babel-loader",
            {
              loader: "ts-loader",
              options: {
                transpileOnly: true,
                experimentalWatchApi: true,
                compilerOptions: {
                  noUnusedLocals: args.mode === "production",
                  noUnusedParameters: args.mode === "production",
                  module: "es2015"
                }
              }
            }
          ],
          exclude: /\/node_modules\//
        },

        /* HTML with environment variables */
        {
          test: /\.html$/,
          use: [
            {
              loader: "string-replace-loader",
              options: {
                multiple: Object.keys(args.mode === "development" ? env! : {})
                  .reduce((variables: any[], key: string) => ([
                    ...variables,
                    {
                      search: `\\\${${key.toLowerCase()}}`,
                      replace: env![key],
                      flags: "g"
                    }
                  ]), [])
              }
            },
            {
              loader: "html-loader",
              options: {
                minimize: true,
                removeAttributeQuotes: false
              }
            }
          ]
        }
      ]
    },

    /* Output configuration */
    output: {
      path: path.resolve(__dirname, "dist"),
      pathinfo: false,
      filename: "[name]" + (
        args.mode === "production" ? ".[chunkhash]" : ""
      ) + ".bundle.js"
    },

    /* Plugins */
    plugins: [

      /* Don't emit assets if there were errors */
      new NoEmitOnErrorsPlugin(),

      /* HTML plugin */
      new HtmlPlugin({
        template: "src/index.html",
        filename: "index.html"
      })
    ],

    /* Module resolver */
    resolve: {
      modules: [
        __dirname,
        "node_modules"
      ],
      extensions: [".ts", ".tsx", ".js", ".json"],
      plugins: [
        new TsconfigPathsPlugin()
      ]
    },

    /* Sourcemaps */
    devtool: "source-map",

    /* Development server configuration */
    devServer: {
      contentBase: "/dist/",
      historyApiFallback: true,
      hot: true,
      port: 9090,
      stats: {
        warningsFilter: /export .* was not found in/
      } as any,

      /* Proxy all /identity requests to API development server */
      before: (app: Application) => app.use("/identity", proxy({
        target: "http://localhost:9091",
        changeOrigin: true
      }))
    },

    /* Optimizations */
    optimization: {
      splitChunks: {
        cacheGroups: {
          commons: {
            chunks: "initial",
            minChunks: 2,
            maxInitialRequests: 5,
            minSize: 0
          },
          vendor: {
            test: /node_modules/,
            chunks: "initial",
            name: "vendor",
            priority: 10,
            enforce: true
          }
        }
      }
    },

    /* Filter out irrelevant warnings */
    stats: {
      warningsFilter: /export .* was not found in/
    },

    /* Configuration for watch mode */
    watchOptions: {
      ignored: /\/node_modules\//
    }
  }

  /* We're good to go */
  return config
}
