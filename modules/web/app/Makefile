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

include ../../../share/env/Makefile

# -----------------------------------------------------------------------------

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
	@ [ ! -f ${ROOT}/terraform.tfstate ] || make --silent .env
	$(shell npm bin)/webpack --mode production

# -----------------------------------------------------------------------------
# Rules
# -----------------------------------------------------------------------------
foo:
	echo ${TEST_ARGS}

# Build distribution files
build: node_modules | dist

# Clean distribution files
clean:
	rm -rf dist

# Lint source files
lint: node_modules
	$(shell npm bin --prefix ${ROOT})/tslint \
		-p tsconfig.json "src/**/*.ts*"
	$(shell npm bin --prefix ${ROOT})/tslint \
		-p tests/tsconfig.json "tests/**/*.ts*"

# Start API server and webpack development server
start: node_modules
	@ [ ! -f ${ROOT}/terraform.tfstate ] || make --silent .env
	make -C ../../api/lambda start &
	$(shell npm bin)/webpack-dev-server --mode development --hot --open

# Execute unit tests
test: node_modules
	@ [ ! -f ${ROOT}/terraform.tfstate ] || make --silent .env
	$(shell npm bin)/jest \
		--config tests/jest.json \
		--collectCoverage \
		--no-verbose $(CI:true=--runInBand)

# Execute unit tests in watch mode
watch: node_modules
	@ [ ! -f ${ROOT}/terraform.tfstate ] || make --silent .env
	$(shell npm bin)/jest \
		--config tests/jest.json \
		--verbose \
		--watch

# -----------------------------------------------------------------------------

# Special targets
.PHONY: .FORCE build clean lint start test watch
.FORCE:
