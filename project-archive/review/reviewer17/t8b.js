const H = require('./h.js'), F = require('./flhelp.js');
(async () => {
  await H.run('dis2', { m: 'UK' }, async (h) => { const { p, full, page, answers, btns, log, click, nav, S, auth, sheet, ask } = h;
    await F.bookSimple(h);
    await nav(5); await click('Cancel my next flight', { w: 1200 });
    await nav(3); await ask('what happened to my flight?', 1000);
    await click('Compensation', { w: 1000 }); log('COMP', await answers(1)); log(await btns());
    await click('Full refund', { w: 1000 }); log('REF', await answers(1)); log(await btns()); log('SHEET', await sheet());
    const b = (await btns()).find(x => /refund/i.test(x) && x !== 'Full refund'); if (b) { await click(b, { exact: true, w: 1000 }); log('REF2', await answers(1)); }
    const s1 = await S(); log('after', s1.balance, s1.card.balance, s1.bookings[0].status, JSON.stringify(s1.bookings[0].refunded));
    // try old card's move
    const mv = p.locator('button', { hasText: 'Move to this flight' }).first(); log('movecount', await p.locator('button', { hasText: 'Move to this flight' }).count());
    log('move disabled', await mv.count() ? await mv.isDisabled() : 'gone');
    if (await mv.count() && !(await mv.isDisabled())) { await mv.click(); await p.waitForTimeout(1000); log('OLDMOVE', await answers(1)); }
    const s2 = await S(); log('after2', s2.balance, s2.card.balance, s2.bookings.map(b => b.status + ' ' + b.when).join(' ; '));
    await full('end', 2000);
  });
})();
