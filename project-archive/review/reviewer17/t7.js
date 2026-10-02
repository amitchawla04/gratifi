const H = require('./h.js'), F = require('./flhelp.js');
(async () => {
  await H.run('chg', { m: 'UK' }, async (h) => { const { p, full, answers, btns, log, click, nav, S, auth, sheet } = h;
    await F.bookFamily(h); const s0 = await S(); log('pre', s0.balance, s0.card.balance, s0.bookings[0].total);
    await nav(4); await click('Change date', { w: 1000 });
    await click('Fri 9 Oct', { w: 900 }); log('A2', await answers(1)); log('B2', await btns());
    await click(/^14:15/, { w: 900 });
    log('A3', await answers(1)); log('B3', await btns()); await full('chg3', 2000);
    const pay = (await btns()).find(x => /^(Pay|Confirm|Move|Change)/.test(x)); log('ACTION', pay);
    if (pay) { await click(pay, { exact: true, w: 800 }); log('SHEET', await sheet()); if (await sheet()) await auth(); await p.waitForTimeout(1200); log('A4', await answers(1)); }
    const s1 = await S(); log('post', s1.balance, s1.card.balance, JSON.stringify(s1.bookings[0]).slice(0, 1200)); log('ledger', JSON.stringify(s1.ledger.slice(0, 3)));
  });
})();
