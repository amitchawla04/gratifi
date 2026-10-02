const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => { const b = await chromium.launch(); 
for (const [m, t] of [['AE','2026-09-30T23:30:00+04:00'],['AR','2026-09-30T23:30:00+04:00'],['IN','2026-09-30T02:00:00+05:30'],['SG','2026-09-30T02:00:00+08:00'],['MY','2026-09-30T02:00:00+08:00'],['EU','2026-09-30T02:00:00+01:00']]) {
 const ctx = await b.newContext({ viewport: { width: 420, height: 880 }, timezoneId: 'Asia/Kolkata' }); const p = await ctx.newPage(); await p.clock.install({ time: new Date(t) });
 await p.goto(`file://${__dirname}/../gratifi/review/test.html?m=${m}&tab=chat`); await p.evaluate(() => localStorage.clear()); await p.reload(); await p.waitForTimeout(800)
 for (const q of (m==='AR' ? ['ما عاد ابي اعيش','ولدي شرب كلور'] : ["I don't want to live anymore", 'my son swallowed bleach'])) { await p.fill('.gr-ask input', q); await p.press('.gr-ask input', 'Enter'); await p.waitForTimeout(700); console.log(m, t, q, '=>', (await p.evaluate(() => [...document.querySelectorAll('.gr-answer')].pop()?.innerText || '')).replace(/\s+/g,' ').slice(0, 420)) }
 await p.screenshot({ path: `shots/night-${m}.png` }); await ctx.close() }
 await b.close() })()
