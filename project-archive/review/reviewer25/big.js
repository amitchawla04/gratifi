const run = require('./h.js'); const el = run.el; const m = process.argv[2] || 'UK';
run(`big-${m}`, m, async h => {
  const { p, ask, last, btn, shot, nav } = h;
  await shot('home'); await nav(5); await shot('me'); await nav(3);
  await ask('Flights to Lisbon next weekend for two'); await shot('flights');
  await p.locator('.gr-flight').first().click(); await p.waitForTimeout(500); await shot('fares');
  await btn(/Continue with/); await shot('seats');
  const ov = await p.evaluate(() => { const r = []; document.querySelectorAll('.app *').forEach(e => { if (e.scrollWidth > e.clientWidth + 2 && getComputedStyle(e).overflowX === 'visible' && e.clientWidth > 0) r.push(e.className + ':' + e.scrollWidth + '>' + e.clientWidth) }); return [document.documentElement.scrollWidth, r.slice(0, 15)] }); console.log(JSON.stringify(ov));
  await ask('Hush headphones'); await last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(300); await last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(300); await btn(/^Pay /); await shot('sheet');
}, { font: 200, q: '' });
