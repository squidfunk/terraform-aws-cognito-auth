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

include ../../../share/lambda/Makefile

# -----------------------------------------------------------------------------
# Target hooks
# -----------------------------------------------------------------------------

# Generate declarations from other modules and build email templates
dist-pre: src/verification/index.d.ts \
$(patsubst %.mjml, %.html, $(shell find src -name "*.mjml")) \
$(patsubst %.svg,  %.png,  $(shell find src -name "*.svg"))

# Copy everything but MJML templates and SVGs
dist-post: $(subst src, dist, $(shell find src | grep -E "(html|txt|png)"))

# -----------------------------------------------------------------------------
# Targets
# -----------------------------------------------------------------------------

# Copied email HTML template
dist/%.html: src/%.html
	@mkdir -p dist/$(dir $*)
	cp -r $< $@

# Copied email text template
dist/%.txt: src/%.txt
	@mkdir -p dist/$(dir $*)
	cp -r $< $@

# Copied image used in email template
dist/%.png: src/%.png
	@mkdir -p dist/$(dir $*)
	cp -r $< $@

# -----------------------------------------------------------------------------

# Compiled email HTML template
src/%.html: src/%.mjml
	@mkdir -p dist/$(dir $*)
	$(shell npm bin)/mjml -o $@ $<

# Image used in email templates
src/%.png: src/%.svg
	@mkdir -p dist/$(dir $*)
	$(shell npm bin)/svgexport $< $@ 4x
	$(shell npm bin)/imageoptim $@

# Verification code typings
src/verification/index.d.ts: ../../api/lambda/src/verification/index.ts
	$(shell npm bin)/tsc -d \
		--declarationDir $(dir $@) \
		--emitDeclarationOnly \
		--moduleResolution node \
		--stripInternal \
		--target es2017 $<

# -----------------------------------------------------------------------------
# Rules
# -----------------------------------------------------------------------------

# Rebuild email templates on changes
watch-templates: node_modules | dist-post
	@$(shell npm bin)/browser-sync start \
		--server src/message/templates \
		--files "src/message/templates/**/*.html" &
	@$(shell npm bin)/watch \
		--pattern "src/message/templates/**/*.mjml" \
		--command 'make $$(echo $$FILENAME | sed "s/mjml$$/html/")'
