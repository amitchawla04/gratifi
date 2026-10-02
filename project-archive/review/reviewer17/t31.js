const H = require('./h.js');
const m = process.argv[2] || 'UK';
(async () => {
  await H.run('home' + m, { m }, async (h) => { const { p, nav, answers, log, full } = h;
    const labels = await p.evaluate(() => [...document.querySelectorAll('.app-main button, .app-main [role=button]')].map(b => (b.innerText || b.getAttribute('aria-label') || '').replace(/\s+/g, ' ').trim()).filter(Boolean));
    log('HOME BUTTONS', labels.length, JSON.stringify(labels).slice(0, 1500));
    for (let i = 0; i < labels.length; i++) {
      await nav(1); await p.waitForTimeout(200);
      const bs = p.locator('.app-main button, .app-main [role=button]'); if (i >= await bs.count()) break;
      const lab = (await bs.nth(i).innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 50) || await bs.nth(i).getAttribute('aria-label');
      await bs.nth(i).scrollIntoViewIfNeeded().catch(() => {}); await bs.nth(i).click({ timeout: 3000 }).catch(e => log('fail click', lab)); await p.waitForTimeout(1000);
      const tab = await p.evaluate(() => document.querySelector('.app').dataset.tab);
      const out = tab === 'chat' ? (await answers(1)).replace(/\n/g, ' | ').slice(0, 220) : (await p.evaluate(() => document.querySelector('.app-main').innerText)).replace(/\n/g, ' | ').slice(0, 160);
      const sh = await h.sheet(); log(`[${i}] ${lab} -> ${tab}: ${out}${sh ? ' SHEET:' + sh.slice(0, 80) : ''}`);
      if (sh) { await p.keyboard.press('Escape'); await p.waitForTimeout(300) }
    }
  });
})();
