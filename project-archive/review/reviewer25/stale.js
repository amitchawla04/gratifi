const run = require('./h.js'); const m = process.argv[2] || 'UK';
run(`stale-${m}`, m, async h => {
  const { p, ask, last, lastText, btn, confirm, log, nav, state, sheetText } = h;
  await nav(3);
  await ask('Hush headphones'); await last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(300); await last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(300);
  const coA = p.locator('.gr-answer').last();
  await ask('13-inch laptop'); await last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(300); await last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(300);
  log('laptop CO', (await lastText()).slice(-250));
  await btn(/^Pay /); await confirm(); let s = await state(); log('after laptop', s.balance, s.card.balance);
  await p.reload(); await p.waitForTimeout(900); await nav(3);
  const payA = p.locator('.gr-answer').filter({ hasText: 'Hush 700' }).locator('button', { hasText: /^Pay / });
  log('old A pay count', await payA.count(), await payA.first().isEnabled().catch(() => 'n/a'), await payA.first().innerText().catch(() => ''));
  if (await payA.count()) { await payA.first().scrollIntoViewIfNeeded(); await payA.first().click(); await p.waitForTimeout(500); log('A after click', await sheetText(), (await lastText()).slice(0, 300)); if (await p.$('.app-sheet')) { log('A sheet', await confirm()); } }
  s = await state(); log('final', s.balance, s.card.balance, s.bookings.map(b => b.title + ':' + b.pts + '+' + b.card).join(';'));
  const oldPay = p.locator('.gr-answer').filter({ hasText: '13-inch laptop' }).locator('button', { hasText: /^Pay / });
  log('old laptop pay still live?', await oldPay.count(), await oldPay.first().isEnabled().catch(() => 'n/a'));
}, {});
