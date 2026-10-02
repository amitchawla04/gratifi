const H = require('./h.js');
(async () => {
  await H.run('ret', { m: 'UK' }, async (h) => { const { p, nav, ask, answers, btns, click, log, S, sheet, auth, full, page } = h; await nav(3);
    const A = () => p.locator('.gr-answer').last();
    await ask('Noise-cancelling headphones', 1000); await A().locator('.gr-itemrow').first().click(); await p.waitForTimeout(600); await click('Continue', { exact: true, w: 900 });
    await click(/^Card £/, { w: 300 }); await click(/^Pay /, { w: 700 }); await auth(); let s = await S(); log('after buy', s.balance, s.card.balance, s.bookings[0].earned);
    // spend all points: transfer 48,000 via AI? use donate/transfer. Transfer 20,000 twice + more
    for (const amt of ['20,000', '20,000']) { await ask('Transfer points to miles', 1000); await A().locator('button', { hasText: new RegExp('^' + amt + '$') }).first().click(); await A().locator('input[type=checkbox]').first().check(); await A().locator('button', { hasText: /^Transfer/ }).first().click(); await p.waitForTimeout(600); const mem = A().locator('input'); if (await mem.count()) { await mem.first().fill('NW12345678'); await A().locator('.gr-btn').last().click(); await p.waitForTimeout(600) } await auth(); }
    s = await S(); log('after transfers', s.balance);
    await ask('Donate points to charity', 1000); await A().locator('button', { hasText: /^5,000 pts$/ }).first().click().catch(() => {}); await A().locator('button', { hasText: /^Give points/ }).first().click(); await p.waitForTimeout(500); await auth();
    s = await S(); log('after donate', s.balance);
    await ask('Train to Edinburgh', 1000); await A().locator('.gr-itemrow').first().click(); await p.waitForTimeout(600); await click('Continue', { exact: true, w: 900 }); await click(/^Points and card/, { w: 300 });
    const sl = A().locator('input[type=range]'); log('slider', await sl.count()); if (await sl.count()) { await sl.focus(); await p.keyboard.press('End'); await p.waitForTimeout(200) }
    log('PAYBTN', (await btns()).find(b => /^Pay/.test(b))); await click(/^Pay /, { w: 700 }); await auth(); s = await S(); log('after spend all', s.balance);
    await nav(5); await click('Deliver my order', { w: 1000 });
    await nav(4); await click('Orders', { w: 400 }); await page('orders'); await click('Return', { exact: true, w: 1000 }); log('RET', (await answers(1)).replace(/\n/g, ' | ')); log(await btns()); await full('ret', 1800);
    const rb = (await btns()).find(b => /collection|return|yes|start/i.test(b)); if (rb) { await click(rb, { exact: true, w: 1000 }); if (await sheet()) await auth(); log('RET2', (await answers(1)).replace(/\n/g, ' | ')); }
    s = await S(); log('status', s.bookings.map(b => b.title + ':' + b.status).join(' ; '));
    log('waiting 35s for return timer'); await p.waitForTimeout(36000); await nav(3);
    log('LATER', (await answers(1)).replace(/\n/g, ' | ').slice(0, 500));
    s = await S(); log('final', s.balance, s.card.balance, s.bookings.map(b => b.title + ':' + b.status + ':' + JSON.stringify(b.refunded)).join(' ; ')); log('ledger', JSON.stringify(s.ledger.slice(0, 3))); log('txn', JSON.stringify(s.txns.slice(0, 2)));
  });
})();
