const H = require('./h.js');
(async () => {
  await H.run('offer', { m: 'UK' }, async (h) => { const { p, log, shot } = h;
    const b = p.locator('.app-main button', { hasText: /^Add$/ }).first(); await b.scrollIntoViewIfNeeded(); await b.click(); await p.waitForTimeout(600);
    log(await p.evaluate(() => [...document.querySelectorAll('.app-main button')].map(b => b.innerText).filter(t => /Add/.test(t))));
    await shot('offer');
    await p.click('.gr-nav button:nth-child(3)'); await p.waitForTimeout(400); log(await p.evaluate(() => document.querySelector('.app-main').innerText.slice(0, 300)));
  });
})();
