const run = require('./h.js'); const el = run.el; const m = process.argv[2] || 'UK';
run(`disr-${m}`, m, async h => {
  const { p, ask, last, lastText, btn, confirm, log, nav, state, shot } = h;
  await nav(3);
  await ask('Flights to Lisbon next weekend for two'); await p.locator('.gr-flight').first().click(); await p.waitForTimeout(400);
  await last().locator('.gr-btn').last().click(); await p.waitForTimeout(400);
  const ins = last().locator('input.app-in'); for (let i = 0; i < await ins.count(); i++) if (!(await ins.nth(i).inputValue())) await ins.nth(i).fill('Sam Taylor');
  await last().locator('.gr-btn').last().click(); await p.waitForTimeout(400); await last().locator('[role=radio]').nth(1).click(); await p.waitForTimeout(200);
  await btn(/^Pay /); await confirm(); let s = await state(); log('S0', s.balance, s.card.balance, s.bookings[0].pts, s.bookings[0].card);
  await nav(5); await btn('Cancel my next flight'); await p.waitForTimeout(400); await shot('me-after-disrupt');
  await nav(4); await h.full('wallet-disrupt'); log('wallet', (await p.locator('.app-main').innerText()).replace(/\n+/g, ' | ').slice(0, 500));
  await nav(3); await ask('my flight got cancelled'); log('chat', await lastText()); await el(h, 'disr-chat');
  log('btns', await last().locator('button').allInnerTexts());
  await btn(/full refund|Refund/i).catch(e => log('no refund btn')); await p.waitForTimeout(400); log('ref1', await lastText());
  if (await p.$('.app-sheet')) log('sheet', await confirm());
  const y = p.getByRole('button', { name: /^Yes/ }); if (await y.count()) { await y.last().click(); await p.waitForTimeout(400) }
  log('ref2', await lastText());
  s = await state(); log('S1', s.balance, s.card.balance, s.bookings[0].status);
  await ask('rebook my flight'); log('after', await lastText());
}, {});
