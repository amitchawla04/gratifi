#!/bin/bash
cd $(dirname $0)
M=$1; shift
for s in "$@"; do timeout 280 node drive.js $M $s >> logs/drive-$M.log 2>&1; done
echo DONE >> logs/drive-$M.log
