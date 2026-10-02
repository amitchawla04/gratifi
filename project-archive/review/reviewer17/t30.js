const H = require('./h.js');
(async () => {
  await H.run('pts', { m: 'UK' }, async (h) => { const { p, nav, ask, answers, btns, click, log, S, sheet, auth, full } = h; await nav(3);
    const A = () => p.locator('.gr-answer').last();
    await ask('Transfer points to miles', 1000);
    await A().locator('input[type=checkbox]').first().check(); await A().locator('button', { hasText: /^Transfer/ }).first().click(); await p.waitForTimeout(800);
    log('T1', (await answers(1)).replace(/\n/g, ' | ').slice(0, 400)); log(await btns());
    const mem = A().locator('input'); if (await mem.count()) { await mem.first().fill('NW12345678'); await p.waitForTimeout(200); await A().locator('.gr-btn').last().click(); await p.waitForTimeout(700); }
    log('T2 sheet', (await sheet() || 'none').replace(/\n/g, ' | ')); const s0 = await S(); if (await sheet()) await auth(); log('T3', (await answers(1)).replace(/\n/g, ' | ').slice(0, 400)); let s = await S(); log('delta', s.balance - s0.balance);
    await ask('Put points into gold', 1000); log('INV', (await answers(1)).replace(/\n/g, ' | ').slice(0, 600)); log(await btns()); await full('inv', 1800);
    const go = A().locator('button', { hasText: /^Continue with the partner/ }); log('disabled before tick', await go.isDisabled());
    await A().locator('input[type=checkbox]').first().check(); log('disabled after tick', await go.isDisabled()); await go.click(); await p.waitForTimeout(700);
    log('INV sheet', (await sheet() || 'none').replace(/\n/g, ' | ')); const s1 = await S(); if (await sheet()) await auth(); log('INV done', (await answers(1)).replace(/\n/g, ' | ').slice(0, 400)); s = await S(); log('delta', s.balance - s1.balance);
    await ask('Donate points to charity', 1000); await A().locator('button', { hasText: /^Give points/ }).first().click(); await p.waitForTimeout(700); log('DON sheet', (await sheet() || 'none').replace(/\n/g, ' | ')); if (await sheet()) await auth(); log('DON', (await answers(1)).replace(/\n/g, ' | ').slice(0, 300));
    for (const q of ['Do I need a visa for New York?', 'Travel insurance', 'eSIM for data abroad', 'What does my card cover?', 'Money back on a purchase', 'Show my card offers', 'challenges', 'A sold-out restaurant', 'Find a special gift', 'Ways to earn more', 'How many points do I have?']) { await ask(q, 1000); log('\n>> ' + q + '\n' + (await answers(1)).replace(/\n/g, ' | ').slice(0, 500)); }
    await nav(4); await click('Requests', { w: 500 }); log('REQ', (await p.evaluate(() => document.querySelector('.app-main').innerText)).slice(0, 600));
  });
})();
