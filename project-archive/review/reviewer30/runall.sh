#!/bin/bash
# args: list of market:script
run() { node drive.js $1 $2 $3 >> o-drive.txt 2>&1; }
N=0
for x in "$@"; do m=${x%%:*}; s=${x#*:}; run $m $s light & N=$((N+1)); if [ $N -ge 5 ]; then wait -n; N=$((N-1)); fi; done; wait
echo ALLDONE >> o-drive.txt
