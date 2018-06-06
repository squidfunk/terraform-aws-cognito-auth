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

all: clean | build

# -----------------------------------------------------------------------------
# Constants
# -----------------------------------------------------------------------------

# Email templates
TEMPLATES = $(shell find src -name "*.mjml")

# Images used in email templates
IMAGES = $(shell find src -name "*.svg")

# -----------------------------------------------------------------------------
# Prerequisites
# -----------------------------------------------------------------------------

# Install dependencies
node_modules:
	npm install

# -----------------------------------------------------------------------------
# Targets
# -----------------------------------------------------------------------------

# Compiled templates
dist:
	mkdir -p $@

# Compiled email template
dist/%.html: src/%.mjml dist
	$(shell npm bin)/mjml -o $@ $<

# Image used in email templates
dist/%.png: src/%.svg dist
	$(shell npm bin)/svgexport $< $@ 4x
	$(shell npm bin)/imageoptim $@

# -----------------------------------------------------------------------------
# Rules
# -----------------------------------------------------------------------------

# Build email templates
build: node_modules \
$(patsubst src/%.mjml, dist/%.html, ${TEMPLATES}) \
$(patsubst src/%.svg,  dist/%.png,  ${IMAGES})

# Clean compiled email templates
clean:
	rm -rf dist

# Rebuild email templates on changes
watch: node_modules
	@$(shell npm bin)/browser-sync start \
		--server dist \
		--files dist \
		--no-open &
	@$(shell npm bin)/watch \
		--pattern "src/**/*" \
		--command "make build" \
		> /dev/null

# -----------------------------------------------------------------------------

# Special targets
.PHONY: .FORCE build clean watch
.FORCE:
