const H = require('./h.js'), B = require('./buy.js');
(async () => {
  await H.run('shop', { m: 'UK' }, async (h) => { const { p, nav, ask, answers, btns, click, log, S, sheet, auth, full, page } = h; await nav(3); await ask('hi', 400);
    await B.buy(h, 'Noise-cancelling headphones', { tag: 'hp', pre: async () => { await click('Office', { w: 200 }).catch(() => {}); await click('Silver', { w: 200 }).catch(() => {}); } });
    await B.buy(h, 'Earn extra points shopping', { tag: 'aff' });
    log('AFFBTNS', await btns());
    await B.buy(h, 'A gift card for a friend', { tag: 'gift', pre: async () => { const ins = p.locator('.gr-answer').last().locator('input'); log('gift inputs', await ins.count()); if (await ins.count() >= 2) { await ins.nth(0).fill('Sam'); await ins.nth(1).fill('sam@example.com') } } });
    await nav(4); await page('wallet'); log('W', await p.evaluate(() => document.querySelector('.app-main').innerText.slice(0, 1500)));
  });
})();
