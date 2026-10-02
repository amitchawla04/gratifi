const H = require('./h.js');
(async () => {
  await H.run('excat', { m: 'UK' }, async ({ p, nav, page, log }) => {
    for (const ci of [6, 11, 17]) { await nav(1); await nav(2); await p.locator('.app-catgrid > *').nth(ci).click(); await p.waitForTimeout(300); await page('cat' + ci); }
  });
})();
