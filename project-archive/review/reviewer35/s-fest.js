const { open } = require('./h.js');
(async () => {
  const h = await open({ market: 'UK', tag: 'fest' });
  const { p, full, nav, ask, click, confirm, log, errs, shot, lastText, state } = h;
  try {
    await nav(3); await ask('events this month'); await full('list'); log('LIST', await lastText());
    const rows = p.locator('.gr-answer').last().locator('.gr-itemrow'); const n = await rows.count();
    for (let i = 0; i < n; i++) { await rows.nth(i).click(); await p.waitForTimeout(500); log('DETAIL ' + i, (await lastText()).slice(0, 400)); await full('d' + i); await ask('events this month'); }
  } catch (e) { log('FAIL', e.message.split('\n')[0]); await shot('fail') }
  log('errs', errs); await h.b.close();
})();
