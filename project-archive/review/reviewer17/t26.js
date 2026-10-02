const H = require('./h.js');
(async () => {
  await H.run('credit', { m: 'UK' }, async (h) => { const { p, nav, ask, answers, btns, click, log, S, sheet, auth, full } = h; await nav(3);
    await ask('reduce my limit to 1000', 1000); log('SH', (await sheet() || 'none').replace(/\n/g, ' | ')); if (await sheet()) await auth(); log((await answers(1)).replace(/\n/g, ' | ').slice(0, 300)); let s = await S(); log('limit', s.card.limit, 'avail', s.card.limit - s.card.balance);
    await ask('Noise-cancelling headphones', 1000); await p.locator('.gr-answer').last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(600); await click('Continue', { exact: true, w: 900 });
    log('CHK', (await answers(1)).replace(/\n/g, ' | ').slice(-300)); log(await btns());
    await click(/^Card £/, { w: 400 }); log('after card', (await answers(1)).replace(/\n/g, ' | ').slice(-300), await btns());
    const pay = (await btns()).find(b => /^Pay/.test(b)); if (pay) { await click(pay, { exact: true, w: 800 }); log('sheet', (await sheet() || 'none').replace(/\n/g, ' | ')); if (await sheet()) await auth(); log('RES', (await answers(1)).replace(/\n/g, ' | ').slice(0, 400)); }
    s = await S(); log('card bal', s.card.balance, 'bookings', s.bookings.length);
    // bill part payment
    await ask('pay my bill', 1000); await click('Another amount', { w: 500 }); const inp = p.locator('.gr-answer').last().locator('input'); log('inputs', await inp.count()); if (await inp.count()) { await inp.first().fill('100'); await p.waitForTimeout(300); }
    log('BILL', (await answers(1)).replace(/\n/g, ' | ').slice(0, 400), await btns());
    const pb = (await btns()).find(b => /^Pay/.test(b)); await click(pb, { exact: true, w: 800 }); log('bsheet', (await sheet() || 'none').replace(/\n/g, ' | ')); await auth(); log('PAID', (await answers(1)).replace(/\n/g, ' | ').slice(0, 400));
    s = await S(); log('card', JSON.stringify(s.card));
    await ask('what do I owe?', 1000); log('OWE', (await answers(1)).replace(/\n/g, ' | ').slice(0, 300));
    await ask('pay £5000 off my card', 1000); log('OVER', (await answers(1)).replace(/\n/g, ' | ').slice(0, 300), await btns()); if (await sheet()) { log('osheet', (await sheet()).replace(/\n/g,' | ')); await p.keyboard.press('Escape') }
  });
})();
