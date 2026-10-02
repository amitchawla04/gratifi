#!/bin/bash
# runq.sh "M:script M:script ..." -> parallel 5
cd /tmp/claude-0/-home-claude/d2529b2f-e36e-5c22-8d08-213fa2f214ae/scratchpad/reviewer29
for j in $1; do echo $j; done | xargs -P 5 -I{} bash -c 'm=${0%%:*}; s=${0#*:}; t=light; case $m in *d) m=${m%d}; t=dark;; esac; timeout 280 node drive.js $m $s $t > out-$0.txt 2>&1' {}
echo ALLDONE
