#!/bin/bash
cd "$(dirname "$0")"
for m in UK EU IN; do node engdbg.js $m > engdbg-$m.log 2>&1 & done; wait
for m in AE SG MY; do node engdbg.js $m > engdbg-$m.log 2>&1 & done; node engdbg.js AR > engdbg-AR.log 2>&1 & wait
bash drives.sh > drives.log 2>&1
echo ALLDONE > engall.done
