const { open } = require('./h.js');
(async () => {
  const h = await open({ market: 'UK', tag: 'hand' });
  const { p, full, nav, ask, click, confirm, log, errs, shot, lastText } = h;
  try {
    await click('See flights'); await p.waitForTimeout(600); log('BANNER', (await lastText()).slice(0, 300)); await full('banner');
    await nav(1); await click('Show ideas'); await p.waitForTimeout(600); log('IDEAS', (await lastText()).slice(0, 300));
    await nav(1); await p.locator('text=Tidewater House').first().click(); await p.waitForTimeout(600); log('FEATURED', (await lastText()).slice(0, 300)); await full('featured');
    await nav(2); await p.locator('.gr-cattile').nth(1).click(); await p.waitForTimeout(400); await click('City breaks').catch(() => click(/./)); await p.waitForTimeout(600); log('SUBCAT', (await lastText()).slice(0, 300));
    await nav(1); await click('Add', { exact: true }); await p.waitForTimeout(400); await full('offer-added'); log('OFFER', await p.locator('text=Added').count());
  } catch (e) { log('FAIL', e.message.split('\n')[0]); await shot('fail') }
  log('errs', errs); await h.b.close();
})();
