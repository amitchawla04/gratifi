#!/bin/bash
# runr.sh "tag|envQ|scen|market|theme|ai ..." parallel 5
cd /tmp/claude-0/-home-claude/d2529b2f-e36e-5c22-8d08-213fa2f214ae/scratchpad/reviewer29
for j in $1; do echo $j; done | xargs -P 5 -I{} bash -c 'IFS="|" read tag q scen m t ai <<< "$0"; Q=$q timeout 290 node r.js $scen $m $t $ai $tag > o-$tag.txt 2>&1' {}
echo ALLDONE
