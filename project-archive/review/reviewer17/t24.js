const H = require('./h.js');
(async () => {
  await H.run('demo', { m: 'UK' }, async (h) => { const { p, nav, ask, answers, btns, click, log, S, sheet, auth, full, page } = h;
    const toCheckout = async () => { await nav(3); await ask('Book a lounge', 900); await ask('fast track security', 1000); await p.locator('.gr-answer').last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(600); await click('Continue', { exact: true, w: 900 }); };
    const sw = async (name) => { await nav(5); await p.getByRole('switch', { name }).click().catch(async () => { await p.locator('label, div').filter({ hasText: new RegExp('^' + name) }).locator('[role=switch], input').first().click() }); await p.waitForTimeout(300) };
    await nav(5); await click('Points come in (+5,000)', { w: 800 }); let s = await S(); log('points in', s.balance, (await p.evaluate(() => document.querySelector('.app-main').innerText)).match(/[\d,]+\nPOINTS/)?.[0]);
    await click('A card payment', { w: 800 }); s = await S(); log('card payment', s.card.balance, s.txns[0].merchant, s.txns[0].amount);
    await nav(3); log('CHAT after demo', (await answers(1)).replace(/\n/g, ' | ').slice(0, 300));
    // price rise
    await sw('Price rises at the next checkout'); s = await S(); log('priceRise', s.sim.priceRise);
    await toCheckout(); log('CHK', (await answers(1)).replace(/\n/g, ' | ').slice(0, 400)); await click(/^Pay /, { w: 800 }); log('PR sheet', (await sheet() || 'none').replace(/\n/g, ' | ')); if (await sheet()) await auth(); log('PR after', (await answers(1)).replace(/\n/g, ' | ').slice(0, 500)); log(await btns());
    s = await S(); log('bookings', s.bookings.length, s.balance);
    // supplier down
    await sw('Supplier is down'); const s0 = await S(); await toCheckout(); await click(/^Pay /, { w: 800 }); if (await sheet()) await auth(); log('SD after', (await answers(1)).replace(/\n/g, ' | ').slice(0, 500)); s = await S(); log('SD delta', s.balance - s0.balance, s.card.balance - s0.card.balance, s.bookings.length - s0.bookings.length);
    await sw('Supplier is down');
    // decline
    await sw('Card is declined'); const s2 = await S(); await toCheckout(); await click(/^Card £/, { w: 300 }); await click(/^Pay /, { w: 800 }); if (await sheet()) await auth(); log('DEC after', (await answers(1)).replace(/\n/g, ' | ').slice(0, 500)); s = await S(); log('DEC delta', s.balance - s2.balance, s.card.balance - s2.card.balance, s.bookings.length - s2.bookings.length);
    await sw('Card is declined');
    await nav(5); await click('Suspicious payment', { w: 1000 }); await nav(3); log('SUSP', (await answers(1)).replace(/\n/g, ' | ').slice(0, 500)); log(await btns()); await full('susp', 1600);
    await nav(5); await click('Return window ends', { w: 1000 }); await nav(3); log('RWE', (await answers(1)).replace(/\n/g, ' | ').slice(0, 300));
    await nav(5); await click('Delay my order', { w: 1000 }); await nav(3); log('DELAY', (await answers(1)).replace(/\n/g, ' | ').slice(0, 300));
    await nav(5); await click('Deliver my order', { w: 1000 }); await nav(3); log('DELIV', (await answers(1)).replace(/\n/g, ' | ').slice(0, 300));
    await nav(5); await click('Reset demo', { w: 1000 }); log('reset sheet?', await sheet()); s = await S(); log('after reset', s && s.balance, s && s.bookings.length, s && s.chat.length);
  });
})();
