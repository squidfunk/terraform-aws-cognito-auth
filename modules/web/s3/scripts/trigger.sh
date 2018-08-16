#!/bin/bash

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

# Exit if any of the intermediate steps fails
set -e

# Extract "DIRECTORY" argument from the input into DIRECTORY shell variables.
# jq will ensure that the values are properly quoted and escaped for
# consumption by the shell.
eval "$(jq -r '@sh "DIRECTORY=\(.directory)"')"

# Placeholder for whatever data-fetching logic
CHECKSUM=`shasum -a 256 ${DIRECTORY}/* | shasum -a 256 | awk '{ print $1 }'`

# Safely produce a JSON object containing the result value. jq will ensure that
# the value is properly quoted and escaped to produce a valid JSON string.
jq -n --arg checksum "$CHECKSUM" '{"checksum":$checksum}'
