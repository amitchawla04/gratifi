#!/bin/bash
cd "$(dirname "$0")"
rm -f missing.txt
for m in ${MARKETS:-UK EU IN AE AR SG MY}; do for s in tabs explore flight stays dining grocery shopping gift subs tickets airport rides experiences bank points docs concierge problems manage cards; do node drive.js $m $s & done; wait; done 2>&1 | grep -v "^\[\|Done\|clean\|card balance"
echo "--- missing"; sort -u missing.txt 2>/dev/null | grep -v '^$'
echo DONE
