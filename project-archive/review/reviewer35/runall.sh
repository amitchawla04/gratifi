#!/bin/bash
cd $(dirname $0)
for m in UK IN MY AR; do
 for s in flight stays dining grocery shopping gift subs tickets airport rides experiences bank points docs concierge problems manage; do
   timeout 240 node drive.js $m $s light >> drive.log 2>&1 &
   while [ $(jobs -r | wc -l) -ge 3 ]; do sleep 1; done
 done
done
wait; echo DONE >> drive.log
