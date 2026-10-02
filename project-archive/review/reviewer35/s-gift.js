const { open } = require('./h.js');
(async () => {
  const h = await open({ market: 'UK', tag: 'gift' });
  const { p, full, nav, ask, click, confirm, log, errs, shot, lastText, state } = h;
  try {
    await nav(3); await ask('A gift card for a friend'); await p.locator('.gr-answer').last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(400);
    const btn = p.locator('.gr-answer').last().locator('.gr-detail .gr-btn').last(); log('btn no name/email', await btn.innerText(), await btn.isEnabled());
    const ins = p.locator('.gr-answer').last().locator('.app-in'); log('inputs', await ins.count());
    await ins.nth(0).fill('Sam'); log('btn name only', await btn.innerText(), await btn.isEnabled());
    await ins.nth(1).fill('sam@'); log('btn bad email', await btn.innerText(), await btn.isEnabled());
    await ins.nth(1).fill('sam@example.com'); log('btn ok', await btn.innerText(), await btn.isEnabled());
    await full('gift-detail');
    // free text "for me"
    await ask('a £25 gift card for myself'); log('ME', await lastText());
    await ask('remind me when my bill is due'); await ask('remind me when flights to Paris drop'); await nav(5); await full('me-alerts');
    const rm = p.getByRole('button', { name: /Remove/ }); log('remove buttons', await rm.count()); if (await rm.count()) { await rm.first().click(); await p.waitForTimeout(400); log('after remove', await p.getByRole('button', { name: /Remove/ }).count()) }
  } catch (e) { log('FAIL', e.message.split('\n')[0]); await shot('fail') }
  log('errs', errs); await h.b.close();
})();
