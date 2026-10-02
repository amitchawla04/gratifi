#!/bin/bash
# usage: batch.sh MARKET THEME script...
M=$1; T=$2; shift 2
for s in "$@"; do timeout 280 node drive.js $M $s $T >> batch-$M$T.log 2>&1; done
echo DONE >> batch-$M$T.log
