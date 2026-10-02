#!/bin/bash
M=$1; shift
for s in "$@"; do node drive.js $M $s; done
