const H = require('./h.js');
(async () => {
  await H.run('otp', { m: 'IN' }, async (h) => { const { p, nav, ask, answers, btns, click, log, S, sheet, auth, full, shot, url } = h; await nav(3);
    await ask('Milk, eggs and bread', 1000); await click('Checkout', { exact: true, w: 900 }); log('CHK', (await answers(1)).replace(/\n/g, ' | ').slice(0, 600));
    await click(/^Pay /, { w: 700 }); log('SHEET', (await sheet()).replace(/\n/g, ' | ')); await shot('otp');
    const s0 = await S();
    for (let k = 0; k < 3; k++) { const ins = await p.$$('.app-sheet input'); if (ins.length >= 6) { for (let i = 0; i < 6; i++) await ins[i].fill('111111'[i]) } else await ins[0].fill('111111'); await p.locator('.app-sheet .gr-btn').last().click().catch(e => log('btn', e.message.slice(0, 60))); await p.waitForTimeout(1200); log('TRY', k, (await sheet() || 'closed').replace(/\n/g, ' | ')); await shot('try' + k); }
    const s1 = await S(); log('money moved?', s1.balance - s0.balance, s1.card.balance - s0.card.balance, s1.bookings.length);
    await p.reload(); await p.waitForTimeout(800); await nav(3);
    await click(/^Pay /, { w: 700 }).catch(e => log('no pay btn after reload')); log('AFTER RELOAD', (await sheet() || 'none').replace(/\n/g, ' | ')); await shot('reload');
    await p.waitForTimeout(3000); log('LATER', (await sheet() || 'none').replace(/\n/g, ' | '));
  });
})();
