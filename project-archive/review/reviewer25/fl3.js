const run = require('./h.js'); const m = process.argv[2] || 'UK';
run(`fl3-${m}`, m, async h => {
  const { p, ask, last, lastText, btn, confirm, shot, full, log, nav, state } = h;
  await nav(3);
  await ask('Flights to Lisbon from 9 to 13 October for 2 adults and a child aged 7');
  await p.locator('.gr-flight').first().click(); await p.waitForTimeout(500);
  await btn(/Continue with/);
  const ins = last().locator('input');
  await ins.nth(1).fill('Priya Chawla'); await ins.nth(2).fill('Lily Chawla'); await ins.nth(3).fill('2019-03-02');
  await btn('Continue', { exact: true }); await btn(/^Pay /); await confirm();
  let s = await state(); log('S0', s.balance, s.card.balance, s.card.due);
  await ask('change my return flight to the 14th');
  await btn(/^Continue, /); log('G', await lastText()); await shot('chgco');
  const pb = p.getByRole('button', { name: /^Pay / }); if (await pb.count()) { await pb.last().click(); log('SHEET', await confirm()); }
  log('H', await lastText()); await shot('changed');
  s = await state(); log('S1', s.balance, s.card.balance, s.card.due, JSON.stringify(s.bookings[0].detail), s.bookings[0].total, s.bookings[0].card, s.bookings[0].pts);
  await ask('Can I have my boarding pass?'); log('I', await lastText());
  await ask('Cancel my Lisbon flight'); log('J', await lastText()); await shot('cancelask');
  await btn(/Yes, cancel/); const sh = await p.$('.app-sheet'); if (sh) log('SHEET2', await confirm());
  log('K', await lastText()); await shot('cancelled');
  s = await state(); log('S2', s.balance, s.card.balance, s.card.due, s.bookings[0].status, JSON.stringify(s.ledger || s.history || '').slice(0, 1500));
  await nav(5); await full('me-after');
}, {});
