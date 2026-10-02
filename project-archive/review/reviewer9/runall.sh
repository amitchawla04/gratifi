for m in $MARKETS; do for s in $SCRIPTS; do timeout 200 node drive.js $m $s $THEME; done; done
