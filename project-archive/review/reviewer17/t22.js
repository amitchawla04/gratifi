const H = require('./h.js');
const m = process.argv[2] || 'AR', theme = process.argv[3] || 'light';
(async () => {
  await H.run('tabs' + m + theme, { m, theme }, async ({ page, nav, p, log, click }) => {
    await page('home'); await nav(2); await page('explore'); await p.locator('.app-catgrid > *').nth(0).click(); await p.waitForTimeout(300); await page('explore-flights'); await nav(3); await page('chat'); await nav(4); await page('wallet'); await nav(5); await page('me');
    const miss = await p.evaluate(() => [...(window.__missing || [])]); log('missing', miss.slice(0, 40));
    const latin = await p.evaluate(() => { const out = new Set(); const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let n; while (n = w.nextNode()) { const t = n.textContent.trim(); if (/[A-Za-z]{3,}/.test(t) && !/Gratifi|Face ID|Northway|Coastline|Aurora|Harrow|Tidewater/.test(t)) out.add(t.slice(0, 60)) } return [...out].slice(0, 60) }); log('LATIN on me', latin);
  });
})();
