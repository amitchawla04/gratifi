cd /tmp/claude-0/-home-claude/d2529b2f-e36e-5c22-8d08-213fa2f214ae/scratchpad/reviewer16
for s in stays dining grocery shopping gift subs tickets airport rides experiences bank points docs concierge problems manage explore; do timeout 240 node drive.js ${M:-UK} $s ${T:-light}; done
