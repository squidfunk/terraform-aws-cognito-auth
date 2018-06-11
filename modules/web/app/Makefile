# Copyright (c) 2017-2018 Martin Donath <martin.donath@squidfunk.com>

# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to
# deal in the Software without restriction, including without limitation the
# rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
# sell copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:

# The above copyright notice and this permission notice shall be included in
# all copies or substantial portions of the Software.

# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NON-INFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
# FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
# IN THE SOFTWARE.

all: lint clean | build test

# -----------------------------------------------------------------------------
# Prerequisites
# -----------------------------------------------------------------------------

# Install dependencies
node_modules:
	npm install

# -----------------------------------------------------------------------------
# Targets
# -----------------------------------------------------------------------------

# Distribution files
dist: $(shell find src) webpack.config.ts
	$(shell npm bin)/webpack --mode production

# -----------------------------------------------------------------------------
# Rules
# -----------------------------------------------------------------------------

# Build distribution files
build: node_modules | dist

# Clean distribution files
clean:
	rm -rf coverage dist

# Lint source files
lint: node_modules
	$(shell npm bin)/tslint -p tsconfig.json "{src,tests}/**/*.ts"

# Start development server
start: node_modules
	$(shell npm bin)/webpack-dev-server --mode development --hot --open

# Execute unit tests
test: node_modules
	@ echo "TBD"

# Execute unit tests in watch mode
watch: node_modules
	@ echo "TBD"

# -----------------------------------------------------------------------------

# Special targets
.PHONY: .FORCE build clean lint test watch
.FORCE:

# -----------------------------------------------------------------------------

# Default target resolution
%: %_
	@ true
