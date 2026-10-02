const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
const R = '/tmp/claude-0/-home-claude/d2529b2f-e36e-5c22-8d08-213fa2f214ae/scratchpad/gratifi/review/';
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 420, height: 880 }, timezoneId: 'Europe/London' });
  const p = await ctx.newPage(); await p.clock.install({ time: new Date('2026-09-30T12:30:00+01:00') });
  await p.goto(`file://${R}test.html?m=UK`); await p.evaluate(() => localStorage.clear()); await p.reload(); await p.waitForTimeout(800);
  await p.click('.gr-nav button:nth-child(3)'); await p.waitForTimeout(300);
  await p.fill('.gr-ask input', 'cinema tonight'); await p.press('.gr-ask input', 'Enter'); await p.waitForTimeout(900);
  await p.locator('.gr-answer').last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(400);
  const d = p.locator('.gr-answer').last();
  console.log(await d.locator('button').evaluateAll(xs => xs.map(x => x.textContent + (x.disabled ? '[dis]' : ''))));
  await d.locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(400);
  console.log((await p.locator('.gr-answer').last().innerText()).replace(/\n+/g, ' | '));
  await p.screenshot({ path: 'shots/cinema-late.png' });
  await b.close();
})();
