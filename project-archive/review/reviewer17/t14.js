const H = require('./h.js');
(async () => {
  await H.run('claim', { m: 'UK' }, async (h) => { const { p, nav, ask, answers, btns, click, log, S, sheet, auth, full, page } = h; await nav(3);
    await ask('Milk, eggs and bread', 1000); await full('basket', 1800);
    await click('Checkout', { exact: true, w: 900 }); await click(/^Card £/, { w: 300 }).catch(e => log('nocard', e.message.slice(0,80))); await click(/^Pay /); await auth(); await p.waitForTimeout(1500);
    const s0 = await S(); log('paid', s0.bookings[0].pts, s0.bookings[0].card, 'bal', s0.balance, s0.card.balance);
    await nav(5); await click('Deliver my order', { w: 1200 }); await nav(3);
    log('after deliver', (await answers(1)).replace(/\n/g, ' | ').slice(0, 400));
    await ask('the eggs were broken and the bread is missing', 1500); log('CLAIM', (await answers(1)).replace(/\n/g, ' | ').slice(0, 800)); log(await btns()); await full('claim', 1800);
    await click('Report a problem', { exact: true, w: 1000 }); log('REP', (await answers(1)).replace(/\n/g, ' | ').slice(0, 800)); log(await btns()); await full('rep', 1800);
    await click('Something was missing', { exact: true, w: 600 }); log('REP2', (await answers(1)).replace(/\n/g, ' | ').slice(0, 800)); log(await btns()); await full('rep2', 1800);
    const A = p.locator('.gr-answer').last();
    const labels = A.locator('label'); for (let i = 0; i < await labels.count(); i++) log('label', i, await labels.nth(i).innerText());
    const sb = A.locator('button', { hasText: 'Sourdough' }); log('sbhtml', await sb.evaluate(e => e.outerHTML.slice(0, 400))); await sb.click(); await p.waitForTimeout(300); await A.locator('button', { hasText: 'Free-range' }).click(); await p.waitForTimeout(300); log('after tick', await btns());
    const boxes = A.locator('input[type=checkbox], [role=checkbox]'); log('boxes', await boxes.count());
    for (let i = 0; i < await boxes.count(); i++) log(i, await boxes.nth(i).isChecked().catch(() => '?'));
    const sub = (await btns()).find(b => /refund|claim|send/i.test(b) && !/photo/i.test(b)); log('SUBMIT', sub);
    if (sub) { await click(sub, { exact: true, w: 1200 }); log('sheet', await sheet()); log('RES', (await answers(1)).replace(/\n/g, ' | ').slice(0, 600)); }
    const s1 = await S(); log('after', s1.balance - s0.balance, +(s1.card.balance - s0.card.balance).toFixed(2), s1.bookings.map(b => b.title + ':' + b.status + ':' + JSON.stringify(b.refunded)).join(' ; '));
    await nav(4); await click('Orders', { w: 500 }); await page('orders');
  });
})();
