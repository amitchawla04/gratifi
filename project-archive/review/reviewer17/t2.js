const H = require('./h.js');
(async () => {
  await H.run('explore', { m: 'UK' }, async ({ p, page, full, nav, click, answers, log }) => {
    await nav(2); await click(/^Flights/); await page('flights-sub');
    log('SUB', await p.evaluate(() => document.querySelector('.app-main').innerText.slice(0, 1500)));
    const btns = await p.evaluate(() => [...document.querySelectorAll('.app-main button')].map(b => b.innerText.replace(/\s+/g, ' ')).slice(0, 40)); log(btns);
    await p.locator('.app-main button').nth(2).click(); await p.waitForTimeout(800); await full('after-sub');
    log('ANS', await answers(1));
  });
})();
