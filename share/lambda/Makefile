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

all: lint clean | build test

# -----------------------------------------------------------------------------
# Constants
# -----------------------------------------------------------------------------

# Build-time dependency location
NPM_BIN = $(shell npm bin --prefix ${ROOT})

# Test suite (default: all)
SUITE ?= unit

# -----------------------------------------------------------------------------
# Prerequisites
# -----------------------------------------------------------------------------

# Install dependencies
node_modules:
	npm install

# -----------------------------------------------------------------------------
# Target hooks
# -----------------------------------------------------------------------------

# Pre- and post hooks for distribution
dist-pre_:
dist-post_:

# Clean hooks
clean-pre_:
clean-post_:

# -----------------------------------------------------------------------------
# Targets
# -----------------------------------------------------------------------------

# Distribution files
dist: $(shell find src) tsconfig.json
	${NPM_BIN}/tsc -p tsconfig.json

# Archive for distribution
dist.zip: $(shell find src) | dist-pre dist dist-post
	@ (rm -f $@ \
		&& cd dist \
		&& cp ../package*.json . \
		&& npm install --production \
		&& rm -rf package*.json node_modules/aws-sdk etc \
		&& zip -rq ../$@ * \
		&& rm -rf node_modules)

# -----------------------------------------------------------------------------
# Default rules
# -----------------------------------------------------------------------------

# Clean distribution files
clean_:
	rm -rf .nyc_output coverage dist dist.zip

# -----------------------------------------------------------------------------
# Rules
# -----------------------------------------------------------------------------

# Build distribution files
build: node_modules | dist.zip

# Clean distribution files
clean: | clean-pre clean_ clean-post

# Lint source files
lint: node_modules
	${NPM_BIN}/tslint -p tsconfig.json "src/**/*.ts"
	${NPM_BIN}/tslint -p tests/tsconfig.json "tests/**/*.ts"

# Execute tests
test: node_modules | dist-pre
	@ [ ! -f ${ROOT}/terraform.tfstate ] || make --silent .env
	@ NODE_ENV=test ${NPM_BIN}/nyc \
		${NPM_BIN}/ts-node \
			-r tsconfig-paths/register \
			--project tests/tsconfig.json \
			--files tests "suites/${SUITE}/**/*.spec.ts"

# Execute tests in watch mode
watch: node_modules
	@ NODE_ENV=development ${NPM_BIN}/nodemon \
		--quiet --watch src --watch tests --ext json,ts \
		--exec ${NPM_BIN}/ts-node \
			-r tsconfig-paths/register \
			--project tests/tsconfig.json \
			--files tests "suites/${SUITE}/**/*.spec.ts"

# -----------------------------------------------------------------------------

# Special targets
.PHONY: .FORCE build clean lint test watch
.FORCE:

# -----------------------------------------------------------------------------

# Default target resolution
%: %_
	@ true
