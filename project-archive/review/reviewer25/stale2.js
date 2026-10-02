const run = require('./h.js'); const m = process.argv[2] || 'UK';
run(`stale2-${m}`, m, async h => {
  const { p, ask, last, lastText, btn, confirm, log, nav, state, sheetText } = h;
  await nav(3);
  await p.evaluate(() => { window.__plan = async (t, o, run) => { const r = await run('search_catalogue', { category: 'shopping', query: 'headphones' }); await run('prepare_checkout', { id: 'SH-1' }); return 'Confirm with the button.' } });
  await ask('buy the hush headphones', 1200); log('A', (await lastText()).slice(-200));
  await p.evaluate(() => { window.__plan = async (t, o, run) => { await run('points_and_giving', { topic: 'transfer', points: 30000, to: 'Northway' }); return 'Tick the box and confirm.' } });
  await ask('transfer 30000 points to Northway Miles', 1200); log('B', (await lastText()).slice(0, 400));
  await last().locator('input.app-in').fill('NW4821930'); await last().locator('.gr-btn').last().click(); await p.waitForTimeout(400); log('B1', (await lastText()).slice(0,300)); if (await p.$('.app-sheet')) log('TSHEET', await confirm()); log('B1b', (await lastText()).slice(0,300)); const ack = last().locator('input[type=checkbox], [role=checkbox]'); if (await ack.count()) await ack.first().click();
  log('B btns', await last().locator('button').allInnerTexts()); await run.el(h, 'stale2-transfer'); log('html', (await last().innerHTML()).slice(0, 1500));
  if (await p.$('.app-sheet')) log('sheet', await confirm()); log('B3', (await lastText()).slice(0, 300));
  let s = await state(); log('bal', s.balance);
  const payA = p.locator('.gr-answer').filter({ hasText: 'Hush 700' }).locator('button', { hasText: /^Pay / });
  log('A btn', await payA.first().innerText().catch(() => 'none'));
  await payA.first().scrollIntoViewIfNeeded(); await payA.first().click(); await p.waitForTimeout(500); log('A click', await sheetText(), (await lastText()).slice(0, 300));
  if (await p.$('.app-sheet')) log('A sheet', await confirm());
  s = await state(); log('final', s.balance, s.card.balance, s.bookings.length);
}, { ai: true });
