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

all: lint | build

# -----------------------------------------------------------------------------
# Targets
# -----------------------------------------------------------------------------

# Git pre-commit hook
.git/hooks/pre-commit:
	ln -fs ../../.githooks/pre-commit $@

# -----------------------------------------------------------------------------
# Rules
# -----------------------------------------------------------------------------

# Initialize repository
init: .git/hooks/pre-commit

# -----------------------------------------------------------------------------

# Build distribution files
build:
	make -C modules/api/lambda build
	make -C modules/identity/lambda build

# Clean distribution files
clean:
	make -C modules/api/lambda clean
	make -C modules/identity/lambda clean

# Lint source files
lint:
	make -C modules/api/lambda lint
	make -C modules/identity/lambda lint

# Execute unit tests
test:
	make -C modules/api/lambda test
	make -C modules/identity/lambda test

# -----------------------------------------------------------------------------

# Special targets
.PHONY: .FORCE build clean lint test
.FORCE:
