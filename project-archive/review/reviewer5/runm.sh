#!/bin/bash
cd /tmp/claude-0/-home-claude/d2529b2f-e36e-5c22-8d08-213fa2f214ae/scratchpad/reviewer5
M=$1; shift; TH=${TH:-light}
for s in "$@"; do timeout 120 node drive.js $M $s $TH; done
