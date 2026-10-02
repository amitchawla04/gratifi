const H = require('./h.js'), F = require('./flhelp.js');
(async () => {
  await H.run('chg', { m: 'UK' }, async (h) => { const { p, full, answers, btns, log, click, nav, S, auth, sheet } = h;
    await F.bookFamily(h); const s0 = await S(); log('pre', s0.balance, s0.card.balance);
    await nav(4); await click('Change date', { w: 1000 });
    await click('Fri 9 Oct', { w: 900 });
    const A = () => p.locator('.gr-answer').last();
    await A().locator('[role=radio]').filter({ hasText: '14:15' }).first().click(); await p.waitForTimeout(500);
    await A().locator('button', { hasText: /^Continue/ }).last().click(); await p.waitForTimeout(800);
    log('SHEET', await sheet()); await auth(); await p.waitForTimeout(1000);
    log('A4', await answers(1));
    const s1 = await S(); log('post', s1.balance, s1.card.balance, s1.bookings[0].when, s1.bookings[0].total, s1.bookings[0].pts, s1.bookings[0].card, JSON.stringify(s1.bookings[0].detail));
    // now change flight back to far date
    await nav(4); await page2();
    async function page2() {}
    await click('Change date', { w: 1000 }); await A().locator('[role=tab], button', { hasText: 'Flight back' }).first().click(); await p.waitForTimeout(500);
    const days = await A().locator('[role=radio]').allInnerTexts(); log('BACK DAYS', days.length, days[0], days[days.length - 1]);
    await full('back', 1600);
    await ask2();
    async function ask2() { await h.ask('Move my return flight to 5 March 2027', 1200); log('FREE', await answers(1)); }
  });
})();
