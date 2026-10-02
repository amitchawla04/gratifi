cd /tmp/claude-0/-home-claude/d2529b2f-e36e-5c22-8d08-213fa2f214ae/scratchpad/reviewer32
for s in flight stays dining grocery shopping gift subs tickets airport rides experiences bank points docs concierge problems manage explore; do
  node drive.js $1 $s >> logs/drive-$1.log 2>&1
done
echo DONE >> logs/drive-$1.log
