const { open } = require('./h.js');
(async () => {
  const [market = 'UK', theme = 'light', q = 'Flights to Lisbon next weekend for two'] = process.argv.slice(2);
  const h = await open({ market, theme, tag: 'flight' });
  const { p, full, nav, ask, click, confirm, log, errs, lastText, state } = h;
  try {
    const s0 = await state(); log('start bal', s0 && s0.card && s0.card.balance, s0 && s0.balance);
    await nav(3); await ask(q); await full('results'); log('RESULTS', await lastText());
    await p.locator('.gr-flight').first().click(); await p.waitForTimeout(500); await full('fares'); log('FARES', await lastText());
    await click(/Continue with/); await full('seats'); log('SEATS', await lastText());
    const ins = p.locator('.gr-answer').last().locator('input.app-in'); for (let i = 0; i < await ins.count(); i++) { if (!(await ins.nth(i).inputValue())) await ins.nth(i).fill(i ? 'Alex Taylor' : 'Sam Taylor') }
    await click('Continue', { exact: true }); await full('checkout'); log('CHECKOUT', await lastText());
    await click(/^Pay /); const st = await confirm(); log('SHEET', st); await full('receipt'); log('RECEIPT', await lastText());
    const s1 = await state(); log('after bal', s1.card.balance, s1.balance, JSON.stringify(s1.bookings.map(b => [b.title, b.status, b.total, b.pts, b.card, b.earned])));
    await nav(4); await full('wallet');
  } catch (e) { log('FAIL', e.message.split('\n')[0]); await h.shot('fail') }
  log('errs', errs); await h.b.close();
})();
