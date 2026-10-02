const H = require('./h.js'), F = require('./flhelp.js');
(async () => {
  await H.run('seat', { m: 'UK' }, async (h) => { const { p, nav, click, answers, btns, log, S, sheet, auth, full } = h;
    await F.bookFamily(h); await nav(4); await click('Change seats', { w: 1000 });
    const A = () => p.locator('.gr-answer').last();
    const seats = async () => A().evaluate(e => [...e.querySelectorAll('button[aria-label^="Seat 14"]')].map(b => b.getAttribute('aria-label') + (b.disabled ? '(dis)' : '')).join(','));
    log('Amit row14', await seats());
    const s14 = A().locator('button[aria-label^="Seat 14"]').first(); if (await s14.count()) { await s14.click().catch(e => log('click fail')); await p.waitForTimeout(300); log('warn', (await answers(1)).split('\n').filter(x => /exit|infant|child/i.test(x)).join(' / ')); }
    await A().locator('button', { hasText: /^Kabir/ }).click(); await p.waitForTimeout(200); log('Kabir row14', await seats());
    await A().locator('button', { hasText: /^Priya/ }).click(); await p.waitForTimeout(200); log('Priya row14', await seats());
    const sp = A().locator('button[aria-label^="Seat 14"]').first(); await sp.click(); await p.waitForTimeout(300);
    log('BTNS', (await btns()).slice(-2)); const save = (await btns()).find(b => /save|pay|seats/i.test(b) && !/^Seat /.test(b)); log('save', save);
    if (save) { await click(save, { exact: true, w: 800 }); log('sheet', (await sheet() || 'none').replace(/\n/g, ' | ')); if (await sheet()) await auth(); log('RES', (await answers(1)).replace(/\n/g, ' | ').slice(0, 400)); }
  });
})();
