const H = require('./h.js');
(async () => {
  for (const m of ['UK']) await H.run('tabs' + m, { m }, async ({ page, nav, p, log }) => {
    await page('home'); await nav(2); await page('explore'); await nav(3); await page('chat'); await nav(4); await page('wallet'); await nav(5); await page('me');
    log(await p.evaluate(() => localStorage.length), Object.keys(await p.evaluate(()=>({...localStorage}))));
  });
})();
