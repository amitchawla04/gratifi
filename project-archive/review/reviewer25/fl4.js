const run = require('./h.js'); const el = run.el; const m = process.argv[2] || 'UK';
run(`fl4-${m}`, m, async h => {
  const { p, ask, last, lastText, btn, confirm, log, nav, state } = h;
  await nav(3);
  await ask('one way to Paris tomorrow evening for me and my baby'); log('A', (await lastText()).slice(0, 500));
  await p.locator('.gr-flight').first().click(); await p.waitForTimeout(400); log('B', (await lastText()).slice(0, 300));
  await last().locator('.gr-btn').last().click(); await p.waitForTimeout(400);
  log('inputs', await last().locator('input').evaluateAll(xs => xs.map(x => x.type + ':' + (x.placeholder || x.getAttribute('aria-label') || x.closest('label')?.textContent))));
  const tx = last().locator('input:not([type=date])'); for (let i=0;i<await tx.count();i++) if (!(await tx.nth(i).inputValue())) await tx.nth(i).fill(i? 'Mia Chawla':'Amit Chawla'); const dt = last().locator('input[type=date]');
  await dt.first().fill('2024-06-01'); await p.waitForTimeout(200); log('dob 2y+', await last().locator('.gr-btn').last().innerText(), (await lastText()).slice(-250));
  await dt.first().fill('2026-11-01'); await p.waitForTimeout(200); log('dob future', await last().locator('.gr-btn').last().innerText(), (await lastText()).slice(-200));
  await dt.first().fill('2026-09-25'); await p.waitForTimeout(200); log('dob 5 days', await last().locator('.gr-btn').last().innerText(), (await lastText()).slice(-200));
  await dt.first().fill('2025-10-15'); await p.waitForTimeout(200); log('dob ok', await last().locator('.gr-btn').last().innerText());
  await p.locator('.gr-seat').nth(12).click().catch(()=>{}); await p.waitForTimeout(200); log('exit try', (await lastText()).slice(-250));
  await last().locator('.gr-btn').last().click(); await p.waitForTimeout(400); log('CO', await lastText());
  await btn(/^Pay /); await confirm(); log('DONE', (await lastText()).slice(0, 300));
  await ask('show my boarding pass'); log('PASS', await lastText()); await el(h, 'fl4-pass');
  await ask('change my flight to the 5th'); log('CHG', (await lastText()).slice(0, 700));
}, {});
