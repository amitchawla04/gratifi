#!/bin/bash
cd "$(dirname "$0")"
find shots -name '*.png' -delete; rm -f missing.txt
for m in ${MARKETS:-UK EU IN AE AR SG MY}; do for s in tabs explore flight stays dining grocery shopping gift subs tickets airport rides experiences bank points docs concierge problems manage; do node drive.js $m $s & done; wait; done 2>&1 | grep -v "^\[\|Done\|clean\|card balance"
echo "--- missing"; sort -u missing.txt 2>/dev/null | grep -v '^$'
echo "--- slop"; ./slop.sh
echo "--- engine"; node engine.js > eng.log 2>&1; grep FAIL eng.log | head -30; tail -2 eng.log
echo "--- ai"; node ai.js 2>&1 | tail -1 | cut -c1-400
echo DONE
