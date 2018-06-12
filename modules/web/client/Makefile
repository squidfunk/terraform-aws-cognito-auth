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

include ../../../share/browser/Makefile

# -----------------------------------------------------------------------------
# Constants
# -----------------------------------------------------------------------------

# Request schemas
SCHEMAS = $(shell (cd ../../api/lambda/src; find handlers -name "*.json"))

# -----------------------------------------------------------------------------
# Target hooks
# -----------------------------------------------------------------------------

# Generate declarations from other modules
dist-pre: $(patsubst handlers/%.json, src/client/resources/%.d.ts, ${SCHEMAS})

# -----------------------------------------------------------------------------
# Targets
# -----------------------------------------------------------------------------

# Request schema typing
src/client/resources/%.d.ts: ../../api/lambda/src/handlers/%.json
	@mkdir -p $(dir $@)
	$(shell npm bin)/json2ts --no-style.semi --input $< --output $@
