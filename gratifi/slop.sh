#!/bin/bash
# Fails if customer-facing copy contains slop. Regex detectors (lines with .test( or match() are ignored.
cd "$(dirname "$0")/src"
hits=$(grep -niE "seamless|\bunlock|elevat(e|ing)|delight|effortless|curated|embark|delve|tailored|hassle.free|game.chang|cutting.edge|world.class|unparalleled|thrilled|rest assured|happy to help|great question|treat yourself|\bstunning|breathtaking|hidden gem|nestled|bustling|unforgettable|immersive|card issuer" flows.ts render.tsx screens.tsx catalog.ts ar-dict.ts ../../kit/src/*.ts* | grep -v "\.test(\|match(\|RegExp\|SLOP\|replace(/" | cut -c1-160)
excl=$(grep -noE "(say|body|title|text|label): ?['\`][^'\`]*[a-z]!['\` ]" flows.ts render.tsx screens.tsx | head)
if [ -n "$hits$excl" ]; then echo "SLOP FOUND"; echo "$hits"; echo "$excl"; else echo "slop: clean"; fi
