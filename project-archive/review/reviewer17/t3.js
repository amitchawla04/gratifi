const H = require('./h.js');
const m = process.argv[2] || 'UK';
(async () => {
  await H.run('subs' + m, { m }, async ({ p, nav, answers, log }) => {
    await nav(2);
    const cats = await p.evaluate(() => [...document.querySelectorAll('.app-catgrid button, .app-catgrid [role=button]')].map(b => b.innerText.split('\n')[0]));
    log('CATS', cats.join(', '));
    for (let ci = 0; ci < cats.length; ci++) {
      await nav(2); await p.evaluate(() => { const b = document.querySelector('.app-main button[aria-label]'); if (b && document.querySelector('.app-subcats, .gr-label')) b.click() }); await p.waitForTimeout(200);
      await p.locator('.app-catgrid > *').nth(ci).click(); await p.waitForTimeout(300);
      const chips = await p.evaluate(() => [...document.querySelectorAll('.app-subcats button')].map(b => b.innerText));
      const asks = await p.evaluate(() => [...document.querySelectorAll('.app-main .gr-sugg button, .app-main [class*=sugg] button')].map(b => b.innerText));
      const rows = await p.evaluate(() => [...document.querySelectorAll('.app-main .gr-itemrow')].map(b => b.innerText.replace(/\n/g, ' | ')).slice(0, 8));
      log(`\n##### ${cats[ci]} chips=[${chips}] asks=[${asks}]\nROWS ${rows.join('\n     ')}`);
      for (let k = 0; k < chips.length; k++) {
        await nav(2); await p.evaluate(() => { const b = document.querySelector('.app-main button[aria-label]'); if (b && document.querySelector('.gr-label')) b.click() }); await p.waitForTimeout(200);
        await p.locator('.app-catgrid > *').nth(ci).click(); await p.waitForTimeout(300);
        await p.locator('.app-subcats button').nth(k).click(); await p.waitForTimeout(900);
        const q = await p.evaluate(() => { const u = [...document.querySelectorAll('.gr-user, .gr-bubble, [class*=user]')]; return u.length ? u[u.length - 1].innerText : '' });
        log(`-- [${chips[k]}] -> "${q}"\n` + (await answers(1)).slice(0, 700).replace(/\n/g, ' | '));
      }
    }
  });
})();
