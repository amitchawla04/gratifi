const run = require('./h.js'); const el = run.el; const m = process.argv[2] || 'UK';
run(`ride2-${m}`, m, async h => {
  const { p, ask, last, lastText, btn, confirm, log, nav } = h;
  await nav(3);
  await ask('A ride now'); await last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(400);
  const d = last().locator('.gr-detail'); const B = d.locator('button');
  await B.nth(5).click(); await p.waitForTimeout(200); await B.nth(1).click(); await p.waitForTimeout(300);
  log('detail', (await d.innerText()).replace(/\n+/g, ' | ').slice(-200));
  await B.last().click(); await p.waitForTimeout(400); log('CO', await lastText());
  await btn(/^Pay /); log('SHEET', await confirm()); log('DONE', await lastText());
  await ask('cancel my ride'); log('C1', await lastText());
  const y = p.getByRole('button', { name: /Yes, cancel/ }); if (await y.count()) { await y.last().click(); await p.waitForTimeout(400); log('C2', await lastText()) }
}, {});
