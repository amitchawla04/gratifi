#!/bin/bash
M=$1; D=$2; TH=${3:-light}; shift 3
for s in "$@"; do SD=$D timeout 240 node drive.js $M $s $TH; done
