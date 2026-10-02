const H = require('./h.js'), F = require('./flhelp.js');
(async () => {
  await H.run('fl2', { m: 'UK' }, async (h) => { const { p, full, answers, btns, log, click, nav, page } = h;
    await F.bookFamily(h);
    await click('Add a hotel', { w: 1000 }); log('HOTEL', (await answers(1)).slice(0, 900));
    await p.locator('.gr-answer').last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(800);
    log('DETAIL', await answers(1)); log('BTNS', await btns()); await full('hotel', 2000);
    await nav(4); await page('wallet');
    log('WALLET', await p.evaluate(() => document.querySelector('.app-main').innerText));
  });
})();
