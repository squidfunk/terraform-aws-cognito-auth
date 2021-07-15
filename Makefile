# Copyright (c) 2018-2019 Martin Donath <martin.donath@squidfunk.com>

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

ifeq (, $(shell which jq))
  $(error jq is not installed, installation instructions at https://stedolan.github.io/jq/)
endif

all: lint | build

# -----------------------------------------------------------------------------
# Prerequisites
# -----------------------------------------------------------------------------

# Install dependencies
node_modules:
	npm install

# -----------------------------------------------------------------------------
# Rules
# -----------------------------------------------------------------------------

# Build distribution files
build: node_modules
	make -C modules/api/lambda build
	make -C modules/identity/lambda build
	make -C modules/message/lambda build
	make -C modules/web/app build
	make -C modules/web/lambda build

# Clean distribution files
clean:
	make -C modules/api/lambda clean
	make -C modules/identity/lambda clean
	make -C modules/message/lambda clean
	make -C modules/web/app clean
	make -C modules/web/lambda clean

# Lint source files
lint: node_modules
	make -C modules/api/lambda lint
	make -C modules/identity/lambda lint
	make -C modules/message/lambda lint
	make -C modules/web/app lint
	make -C modules/web/lambda lint

# Execute unit tests
test: node_modules
	make -C modules/api/lambda test
	make -C modules/identity/lambda test
	make -C modules/message/lambda test
	make -C modules/web/app test
	make -C modules/web/lambda test

# -----------------------------------------------------------------------------

# Special targets
.PHONY: .FORCE build clean lint test
.FORCE:
