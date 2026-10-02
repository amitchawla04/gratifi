for s in tabs flight stays dining grocery shopping gift subs tickets airport rides experiences bank points docs concierge problems manage explore; do timeout 200 node drive.js UK $s; done > batch-UK.log 2>&1
for s in tabs flight grocery bank manage problems; do timeout 200 node drive.js AR $s; done > batch-AR.log 2>&1
for s in flight grocery shopping points; do timeout 200 node drive.js IN $s; node drive.js MY $s; done > batch-INMY.log 2>&1
for s in tabs flight; do timeout 200 node drive.js UK $s dark; done > batch-dark.log 2>&1
echo DONE > batch.done
