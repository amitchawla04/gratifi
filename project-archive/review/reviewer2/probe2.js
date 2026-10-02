const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => { const b = await chromium.launch(); 
for (const m of ['EU','IN','AE','SG','MY']) { const p = await b.newPage({ viewport: { width: 420, height: 880 } }); await p.goto(`file:///tmp/claude-0/-home-claude/d2529b2f-e36e-5c22-8d08-213fa2f214ae/scratchpad/gratifi/review/test.html?m=${m}&tab=chat`); await p.evaluate(() => localStorage.clear()); await p.reload(); await p.waitForTimeout(400)
  for (const q of ['A ride now', 'A hotel', 'Book a lounge', 'Concerts this month', 'Travel insurance', 'Which subscriptions are included?']) { await p.fill('.gr-ask input', q); await p.press('.gr-ask input', 'Enter'); await p.waitForTimeout(300); const t = await p.evaluate(() => { const a = [...document.querySelectorAll('.gr-answer')]; return a[a.length-1].innerText.replace(/\n/g,' | ') }); console.log(m, '>', q, '::', t.slice(0, 520)) }
  await p.close() } await b.close() })()
