const { open } = require('./h.js');
(async () => {
  const h = await open({ market: 'UK', tag: 'man' });
  const { p, full, nav, ask, click, confirm, log, errs, shot, lastText, state } = h;
  const S = async (l) => { const s = await state(); log('  STATE ' + l, s.card.balance, s.balance, JSON.stringify(s.bookings.map(b => [b.title, b.status, b.total, b.pts, b.card, b.earned, b.extra && b.extra.date, b.extra && b.extra.dep, b.extra && b.extra.back && [b.extra.back.date, b.extra.back.dep, b.extra.back.airline]]))) };
  const A = async (q) => { await ask(q, 900); log('\n> ' + q + '\n  ' + (await lastText()).slice(0, 700)); if (await p.$('.app-sheet')) log('  SHEET ' + await h.sheetText()) };
  try {
    await nav(3); await ask('Flights to Lisbon on 9 Oct back 11 Oct for two'); await p.locator('.gr-flight').first().click(); await p.waitForTimeout(500); await click(/Continue with/);
    { const ins = p.locator('.gr-answer').last().locator('input.app-in'); for (let i = 0; i < await ins.count(); i++) { if (!(await ins.nth(i).inputValue())) await ins.nth(i).fill('Sam Taylor') } }
    await click('Continue', { exact: true }); await click(/^Pay /); await confirm(); await S('booked');
    await A('move my return flight to the 13th'); await full('ret13');
    const b = p.locator('.gr-answer').last().locator('.gr-btn:not([disabled])').last(); if (await b.count()) { log('  pressing ' + await b.innerText()); await b.click(); await p.waitForTimeout(600); if (await p.$('.app-sheet')) log('  SHEET ' + await confirm()); log('  AFTER ' + (await lastText()).slice(0, 500)); }
    await S('after ret change');
    await A('can I fly out earlier that day?'); await full('earlier');
    await A('switch my outbound to Coastline'); await full('coast');
    await A('change my seat to 14A'); await full('seat14');
    await A('cancel my flight'); await full('cancel');
    const y = p.getByRole('button', { name: /Yes, cancel/ }); if (await y.count()) { await y.last().click(); await p.waitForTimeout(600); log('  CANCELLED ' + (await lastText()).slice(0, 500)) }
    await S('after cancel');
  } catch (e) { log('FAIL', e.message.split('\n')[0]); await shot('fail') }
  log('errs', errs); await h.b.close();
})();
