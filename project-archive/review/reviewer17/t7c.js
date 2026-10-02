const H = require('./h.js'), F = require('./flhelp.js');
(async () => {
  await H.run('chg', { m: 'UK' }, async (h) => { const { p, full, answers, btns, log, click, nav, S, auth, sheet, ask } = h;
    await F.bookFamily(h); const s0 = await S(); log('pre', s0.balance, s0.card.balance);
    await nav(4); await click('Change date', { w: 1000 });
    await click('Fri 9 Oct', { w: 900 });
    const A = () => p.locator('.gr-answer').last();
    await A().locator('[role=radio]').filter({ hasText: '14:15' }).first().click(); await p.waitForTimeout(500);
    await A().locator('button', { hasText: /^Continue/ }).last().click(); await p.waitForTimeout(800);
    await click(/^Pay /); log('SHEET', await sheet()); await auth(); await p.waitForTimeout(1000);
    log('A5', await answers(1));
    const s1 = await S(); log('post', s1.balance, s1.card.balance, s1.bookings[0].when, s1.bookings[0].total, s1.bookings[0].pts, s1.bookings[0].card, JSON.stringify(s1.bookings[0].detail), JSON.stringify(s1.ledger.slice(0,2)));
    await ask('move my return flight to 5 March 2027', 1200);
    log('RET', (await answers(1)).slice(-400), await btns());
    // cancel now
    await nav(4); await h.page('wallet-after'); await click('Cancel', { exact: true, w: 1000 }); log('CANCEL', await answers(1)); await full('cancel', 1600);
    await click(/^(Yes|Cancel and|Confirm)/, { w: 900 }); log('SHEET2', await sheet()); if (await sheet()) await auth(); await p.waitForTimeout(1000);
    log('A6', await answers(1)); const s2 = await S(); log('post2', s2.balance, s2.card.balance, s2.bookings[0].status, JSON.stringify(s2.bookings[0].refunded), JSON.stringify(s2.ledger.slice(0, 4)), JSON.stringify(s2.txns.slice(0, 2)));
    await nav(4); await click('Cancel', { exact: true, w: 1000 }).catch(e => log('no cancel btn')); log('AGAIN', await answers(1));
    await ask('cancel my lisbon flight', 1000); log('AGAIN2', await answers(1));
  });
})();
