# Copyright (c) 2018 Martin Donath <martin.donath@squidfunk.com>

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

# Build distribution files
dist: $(shell find src) tsconfig.json
	$(shell npm bin)/tsc -p tsconfig.json

# Build archive for distribution
dist.zip: dist
	@(rm -f $< && cd dist && \
		cp ../package*.json . && npm install --production && \
		rm -rf package*.json node_modules/aws-sdk etc && \
		zip -rq ../$@ * && rm -rf node_modules)

# -----------------------------------------------------------------------------
# Rules
# -----------------------------------------------------------------------------

# Build distribution files
build: node_modules dist.zip

# Clean distribution files
clean:
	rm -rf coverage dist dist.zip

# Lint source files
lint: node_modules
	$(shell npm bin)/tslint -p tsconfig.json "{src,tests}/**/*.ts"

# Execute acceptance tests
test-acceptance: node_modules
	@ $(shell npm bin)/ts-node -r tsconfig-paths/register \
		tests/suites/acceptance.ts

# Execute integration tests
test-integration: node_modules
	@ $(shell npm bin)/ts-node -r tsconfig-paths/register \
		tests/suites/integration.ts

# Execute unit tests
test: node_modules
	@NODE_ENV=test $(shell npm bin)/nyc \
		$(shell npm bin)/ts-node -r tsconfig-paths/register \
			tests/suites/unit.ts

# Execute unit tests in watch mode
watch:
	@NODE_ENV=development $(shell npm bin)/nodemon --quiet \
		--watch src --watch tests --exec \
		$(shell npm bin)/ts-node -r tsconfig-paths/register \
			tests/suites/unit.ts

# -----------------------------------------------------------------------------

# Special targets
.PHONY: .FORCE build clean lint test watch
.FORCE:
