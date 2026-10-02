const run = require('./h.js'); const el = run.el; const m = process.argv[2] || 'UK';
run(`money-${m}`, m, async h => {
  const { p, ask, last, lastText, btn, confirm, log, nav, state, sheetText } = h;
  await nav(3);
  await ask('13-inch laptop'); await last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(300);
  for (let i = 0; i < 7; i++) { await last().getByRole('button', { name: /increase|more|\+/i }).last().click().catch(() => { }); await p.waitForTimeout(80) }
  log('detail', (await lastText()).slice(-200));
  await last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(400);
  log('CO', await lastText());
  const radios = last().locator('[role=radio]'); await radios.last().click().catch(() => { }); await p.waitForTimeout(200);
  log('CO-card', (await lastText()).slice(-300));
  const pay = p.getByRole('button', { name: /^Pay / }); if (await pay.count()) { await pay.last().click(); await p.waitForTimeout(400); log('after pay click', await sheetText(), (await lastText()).slice(-300)); if (await p.$('.app-sheet')) await confirm(); }
  let s = await state(); log('S', s.balance, s.card.balance, s.bookings.length);
  // supplier down
  await nav(5); const sw = p.locator('.app-demo [role=switch]'); log('switches', await sw.count()); await sw.nth(1).click(); await nav(3);
  const s0 = await state();
  await ask('Hush headphones'); await last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(300); await last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(300);
  await btn(/^Pay /); const st = await confirm(); log('SUPPLIER sheet', st.slice(0, 100)); log('SUPPLIER', await lastText());
  s = await state(); log('S-sup', s0.balance, '->', s.balance, s0.card.balance, '->', s.card.balance, s0.bookings.length, '->', s.bookings.length);
  await nav(5); await sw.nth(1).click(); await sw.nth(2).click(); await nav(3);
  await ask('Hush headphones'); await last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(300); await last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(300);
  await last().locator('[role=radio]').last().click(); await btn(/^Pay /); await confirm(); log('DECLINED', await lastText());
  s = await state(); log('S-dec', s.balance, s.card.balance, s.bookings.length);
  await nav(5); await sw.nth(2).click(); await sw.nth(0).click(); await nav(3);
  await ask('Hush headphones'); await last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(300); await last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(300);
  await btn(/^Pay /); const st2 = await confirm(); log('RISE', await lastText());
  const cont = p.getByRole('button', { name: /^Continue at/ }); if (await cont.count()) { await cont.last().click(); await p.waitForTimeout(400); log('RISE2', await lastText()); await btn(/^Pay /); log('RISE sheet', await confirm()); log('RISE3', await lastText()) }
  s = await state(); log('S-rise', s.balance, s.card.balance, s.bookings.length, s.bookings[0].total);
}, {});
