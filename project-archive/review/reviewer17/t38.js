const H = require('./h.js');
(async () => {
  await H.run('exrow', { m: 'UK' }, async (h) => { const { p, nav, answers, log } = h;
    await nav(2); await p.locator('.app-catgrid > *').nth(0).click(); await p.waitForTimeout(300);
    await p.locator('.app-main .gr-itemrow').first().click(); await p.waitForTimeout(1200); log((await answers(1)).split('\n').slice(0, 20).join(' | '));
  });
})();
