const H = require('./h.js'), F = require('./flhelp.js');
(async () => {
  await H.run('fl', { m: 'UK' }, async (h) => { const { p, full, answers, btns, log, click, sheet, auth, S } = h;
    
    await F.toTravellers(h); const s0 = await S(); log('START bal', s0.balance, 'card', s0.card.balance); await F.fillFamily(h);
    await p.getByRole('button', { name: 'More Checked bag' }).last().click(); await p.waitForTimeout(200);
    await click('Continue', { exact: true, w: 900 });
    log(await answers(1)); log('BTNS', await btns()); await full('checkout', 2000);
    const pay = (await btns()).find(b => /^Pay/.test(b)); log('PAY', pay);
    await click(/^Pay /); log('SHEET', await sheet()); await h.shot('sheet');
    log('AUTH', await auth()); await p.waitForTimeout(1500);
    log(await answers(1)); await full('receipt', 2000);
    const s1 = await S(); log('END bal', s1.balance, 'card', s1.card.balance, 'ledger', JSON.stringify(s1.ledger.slice(0, 3)), 'txn', JSON.stringify(s1.txns.slice(0, 2)), 'booking', JSON.stringify(s1.bookings[0]).slice(0, 1500));
  });
})();
