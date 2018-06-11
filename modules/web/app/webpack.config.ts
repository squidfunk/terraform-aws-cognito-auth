/*
 * Copyright (c) 2017-2018 Martin Donath <martin.donath@squidfunk.com>
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

import * as autoprefixer from "autoprefixer"
import * as HtmlPlugin from "html-webpack-plugin"
import * as MiniCssExtractPlugin from "mini-css-extract-plugin"
import * as path from "path"
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
 * @param env - Webpack environment
 * @param args - Command-line arguments
 *
 * @return Webpack configuration
 */
export default (_env: any, args: any) => {
  const config: Configuration = {

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
                compilerOptions: {
                  target: "es2015"     /* Use ES modules for tree-shaking */
                }
              }
            }
          ],
          exclude: /\/node_modules\//
        },

        /* SCSS */
        {
          test: /\.scss$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: "css-loader",
              options: {
                minimize: args.mode === "production",
                sourceMap: args.mode === "development"
              }
            },
            {
              loader: "postcss-loader",
              options: {
                ident: "postcss",
                plugins: () => [autoprefixer()],
                sourceMap: args.mode === "development"
              }
            },
            {
              loader: "sass-loader",
              options: {
                sourceMap: args.mode === "development",
                sourceMapContents: true
              }
            }
          ]
        },

        /* HTML */
        {
          test: /\.html$/,
          use: [
            {
              loader: "html-loader",
              options: { minimize: true }
            }
          ]
        }
      ]
    },

    /* Export class constructor as entrypoint */
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "application.js"
    },

    /* Plugins */
    plugins: [

      /* Don't emit assets if there were errors */
      new NoEmitOnErrorsPlugin(),

      /* Extract CSS */
      new MiniCssExtractPlugin({
        filename: "application.css"
      }),

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
      extensions: [".ts", ".tsx", ".js", ".json"]
    },

    /* Sourcemaps */
    devtool: "source-map",

    /* Development server configuration */
    devServer: {
      contentBase: "/dist/",
      historyApiFallback: true
    },

    /* Configuration for watch mode */
    watchOptions: {
      ignored: /\/node_modules\//
    }
  }

  /* We're good to go */
  return config
}
