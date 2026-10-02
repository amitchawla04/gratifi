#!/bin/bash
m=$1; th=${2:-light}
for s in flight stays dining grocery shopping gift subs tickets airport rides experiences bank points docs concierge problems manage; do
  timeout 300 node drive.js $m $s $th
done
