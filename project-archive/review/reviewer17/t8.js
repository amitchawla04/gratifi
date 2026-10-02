const H = require('./h.js'), F = require('./flhelp.js');
(async () => {
  await H.run('dis', { m: 'UK' }, async (h) => { const { p, full, page, answers, btns, log, click, nav, S, auth, sheet, ask } = h;
    await F.bookSimple(h); const s0 = await S(); log('pre', s0.balance, s0.card.balance, s0.bookings[0].pts, s0.bookings[0].card);
    await nav(4); await click('Change seats', { w: 1000 }); log('SEATS', (await answers(1)).slice(0, 600)); log(await btns()); await full('seats', 1800);
    await nav(4); await click('Boarding pass', { w: 1000 }); log('PASS', (await answers(1)).slice(0, 800)); await full('pass', 1800);
    await nav(5); await click('Cancel my next flight', { w: 1200 }); await page('me-after');
    const s1 = await S(); log('booking after demo', s1.bookings[0].status, JSON.stringify(s1.bookings[0].extra.disrupted || s1.bookings[0].extra.airlineCancelled || '').slice(0,300));
    log('CHAT last', (await p.evaluate(() => { const c = [...document.querySelectorAll('.gr-answer')]; return c.length ? c[c.length-1].innerText : 'none' })).slice(0, 800));
    await nav(4); await page('wallet-dis'); log('WALLET', await p.evaluate(() => document.querySelector('.app-main').innerText));
    await nav(1); await page('home-dis');
    await nav(3); await ask('what happened to my flight?', 1000); log('Q1', await answers(1)); log(await btns()); await full('q1', 1600);
  });
})();
