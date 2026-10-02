const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
const R = '/tmp/claude-0/-home-claude/d2529b2f-e36e-5c22-8d08-213fa2f214ae/scratchpad/gratifi/review/';
(async () => {
  const b = await chromium.launch();
  for (const [m, tz, t, qs] of [['AR', 'Asia/Dubai', '2026-09-30T23:30:00+04:00', ['أبي أنتحر', 'سينما']], ['AE', 'Asia/Dubai', '2026-09-30T23:30:00+04:00', ['I want to end my life', 'cinema tickets tonight']], ['AE', 'Asia/Dubai', '2026-10-01T10:00:00+04:00', ['I want to end my life']], ['UK', 'Europe/London', '2026-09-30T22:30:00+01:00', ['cinema tonight', 'a table tonight for two', 'a ride now', 'train to york today']], ['IN', 'Asia/Kolkata', '2026-09-30T23:00:00+05:30', ['I want to die']], ['SG', 'Asia/Singapore', '2026-09-30T23:00:00+08:00', ['I want to die']], ['MY', 'Asia/Kuala_Lumpur', '2026-09-30T23:00:00+08:00', ['I want to die']], ['EU', 'Europe/Dublin', '2026-09-30T23:00:00+01:00', ['I want to die']]]) {
    const ctx = await b.newContext({ viewport: { width: 420, height: 880 }, timezoneId: tz });
    const p = await ctx.newPage(); await p.clock.install({ time: new Date(t) });
    await p.goto(`file://${R}test.html?m=${m}`); await p.evaluate(() => localStorage.clear()); await p.reload(); await p.waitForTimeout(800);
    await p.click('.gr-nav button:nth-child(3)'); await p.waitForTimeout(300);
    for (const q of qs) {
      await p.fill('.gr-ask input', q); await p.press('.gr-ask input', 'Enter'); await p.waitForTimeout(900);
      let txt = (await p.locator('.gr-answer').last().innerText()).replace(/\n+/g, ' | ');
      if (/cinema|سينما/.test(q)) { const r = p.locator('.gr-answer').last().locator('.gr-itemrow').filter({ hasText: /Cinema|سينما/ }); if (await r.count()) { await r.first().click(); await p.waitForTimeout(400); txt += ' >>> ' + (await p.locator('.gr-answer').last().innerText()).replace(/\n+/g, ' | ').slice(0, 500) } }
      if (/table|ride|train/.test(q)) { await p.locator('.gr-answer').last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(400); txt += ' >>> ' + (await p.locator('.gr-answer').last().innerText()).replace(/\n+/g, ' | ').replace(/(Mon|Tue|Wed|Thu|Fri|Sat|Sun) \d+ (Sep|Oct|Nov) \| /g, '').slice(0, 500) }
      console.log(m, t, q, '=>', txt.slice(0, 900));
    }
    await ctx.close();
  }
  await b.close();
})();
