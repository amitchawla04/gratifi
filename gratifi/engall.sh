#!/bin/bash
cd "$(dirname "$0")"
for m in UK EU IN; do node engine.js $m > engine-$m.log 2>&1 & done; wait
for m in AE SG MY; do node engine.js $m > engine-$m.log 2>&1 & done; node engine.js AR > engine-AR.log 2>&1 & wait
./drives.sh > drives.log 2>&1
echo ALLDONE > engall.done
