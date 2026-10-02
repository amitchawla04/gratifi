const run = require('./h.js'); const el = run.el; const m = process.argv[2] || 'UK';
run(`docs-${m}`, m, async h => {
  const { p, ask, last, lastText, btn, confirm, log, nav, state } = h; p.setDefaultTimeout(6000);
  await nav(3);
  await ask('Do I need a visa for New York?'); log('visa', (await lastText()).slice(0, 500)); await el(h, 'docs-visa');
  await ask('Travel insurance'); log('ins', (await lastText()).slice(0, 600));
  const ib = last().locator('.gr-itemrow, .gr-btn'); log('ins btns', await last().locator('button').allInnerTexts());
  await ask('eSIM for data abroad'); log('esim', (await lastText()).slice(0, 400)); await last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(300); log('esim detail', (await lastText()).slice(0, 400));
  await last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(300); log('esim co', (await lastText()).slice(0, 400)); await btn(/^Pay /); log('sheet', await confirm()); log('esim done', (await lastText()).slice(0, 400));
  await ask('Get me a table at a sold-out restaurant'); await p.fill('.app-ta', 'Saturday, 2 people, around 8pm'); await btn('Send to the concierge'); log('conc', (await lastText()).slice(0, 300));
  await nav(4); await p.getByRole('tab', { name: /Requests/ }).click(); await p.waitForTimeout(300); log('requests', (await p.locator('.app-main').innerText()).replace(/\n+/g, ' | ').slice(0, 400));
}, {});
