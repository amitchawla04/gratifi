#!/bin/bash
# usage: batch.sh MARKET THEME script...
M=$1; T=$2; shift 2
for s in "$@"; do timeout 280 node drive.js $M $s $T & while [ $(jobs -r | wc -l) -ge 5 ]; do sleep 1; done; done; wait
