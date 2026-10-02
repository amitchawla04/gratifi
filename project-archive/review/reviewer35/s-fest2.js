const { open } = require('./h.js');
(async () => {
  const h = await open({ market: process.argv[2] || 'UK', tag: 'fest2' });
  const { p, full, nav, ask, click, confirm, log, errs, shot, lastText, state } = h;
  try {
    await nav(3); await ask('food festival'); log('A', await lastText());
    const rows = p.locator('.gr-answer').last().locator('.gr-itemrow'); if (await rows.count()) { await rows.first().click(); await p.waitForTimeout(400) }
    await full('detail'); log('DETAIL', await lastText());
    await p.locator('.gr-answer').last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(500); await full('checkout'); log('CHECKOUT', await lastText());
    await click(/^Pay /); log('SHEET', await confirm()); await full('done'); log('DONE', await lastText());
    const s = await state(); log(JSON.stringify(s.bookings.map(b => [b.title, b.when, b.extra])));
  } catch (e) { log('FAIL', e.message.split('\n')[0]); await shot('fail') }
  log('errs', errs); await h.b.close();
})();
