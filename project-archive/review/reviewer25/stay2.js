const run = require('./h.js'); const el = run.el; const m = process.argv[2] || 'UK';
run(`stay2-${m}`, m, async h => {
  const { p, ask, last, lastText, btn, confirm, log, nav, state } = h;
  await nav(3);
  await ask('a hotel in Lisbon tomorrow for 3 nights, a twin room for 3 people'); log('A', (await lastText()).slice(0, 400));
  await last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(400); log('B', (await lastText()).replace(/(Mon|Tue|Wed|Thu|Fri|Sat|Sun) \d+ (Sep|Oct|Nov|Dec) \| /g, '').slice(0, 600)); await el(h, 'stay2-detail');
  await last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(400); log('C', await lastText());
  await last().locator('[role=radio]').last().click(); await btn(/^Pay /); log('SHEET', await confirm()); log('D', (await lastText()).slice(0, 400));
  await ask('cancel my hotel'); log('E', await lastText());
  await ask('hotel in paris 6 people'); log('F', (await lastText()).slice(0, 300)); await last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(300); log('G', (await lastText()).replace(/(Mon|Tue|Wed|Thu|Fri|Sat|Sun) \d+ (Sep|Oct|Nov|Dec) \| /g, '').slice(0, 500));
  await ask('a hotel in Barcelona for 40 nights'); log('H', (await lastText()).slice(0, 300));
}, {});
