const H = require('./h.js');
(async () => {
  const m = process.argv[2] || 'UK';
  const h = await H.start(m); const { p } = h;
  const sig = () => p.evaluate(() => document.querySelector('.app').dataset.tab + '|' + document.body.innerText.length + '|' + (localStorage.getItem('gratifi-state-v3-' + new URLSearchParams(location.search).get('m')) || '').length + '|' + !!document.querySelector('.app-sheet'));
  for (const tab of [1, 2, 4, 5]) {
    await h.nav(tab);
    const n = await p.locator('.app-main button').count();
    const names = await p.locator('.app-main button').evaluateAll(xs => xs.map(x => (x.getAttribute('aria-label') || x.innerText || '').replace(/\n/g, ' ').slice(0, 40)));
    const dead = [];
    for (let i = 0; i < n; i++) {
      if (/Reset|Yes, reset|Dark mode|Malaysia|India|UAE|Singapore|Eurozone|Kingdom|Forget|Prefer|Use (Office|Home)|Clear/.test(names[i])) continue;
      await h.nav(tab); await p.waitForTimeout(100);
      const b = p.locator('.app-main button').nth(i); if (!(await b.count())) continue;
      const before = await sig(); await b.click({ timeout: 2000 }).catch(() => {}); await p.waitForTimeout(250); const after = await sig();
      if (before === after) dead.push(names[i]);
      if (await p.$('.app-sheet')) await p.keyboard.press('Escape');
    }
    console.log('TAB', tab, 'buttons', n, 'no visible effect:', JSON.stringify(dead));
  }
  await h.b.close();
})();
