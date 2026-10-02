const H = require('./h.js');
(async () => {
  await H.run('reload', { m: 'UK' }, async (h) => { const { p, nav, ask, answers, btns, click, log, S, sheet, auth, full, url } = h; await nav(3);
    await ask('Noise-cancelling headphones', 1000); await p.locator('.gr-answer').last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(600); await click('Continue', { exact: true, w: 900 });
    // reload with checkout pending
    await p.reload(); await p.waitForTimeout(800); await nav(3); log('after reload btns', await btns());
    await click(/^Pay /, { w: 700 }); log('sheet', !!(await sheet())); await auth(); let s = await S(); log('bookings', s.bookings.length, s.balance);
    await p.reload(); await p.waitForTimeout(800); await nav(3);
    const pays = await p.evaluate(() => [...document.querySelectorAll('button')].filter(b => /^Pay /.test(b.innerText)).map(b => b.innerText + ' disabled=' + b.disabled)); log('pay buttons after', pays);
    const cont = await p.evaluate(() => [...document.querySelectorAll('button')].filter(b => /^Continue$/.test(b.innerText.trim())).map(b => 'disabled=' + b.disabled)); log('continue buttons', cont);
    // try the old detail Continue again
    const c = p.locator('button', { hasText: /^Continue$/ }).first(); if (await c.count() && !(await c.isDisabled())) { await c.click(); await p.waitForTimeout(800); log('old continue ->', (await answers(1)).replace(/\n/g, ' | ').slice(0, 300)); }
    await full('reload-end', 2000);
    // double-tap pay test
    await ask('Fast track security', 1000); await p.locator('.gr-answer').last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(600); await click('Continue', { exact: true, w: 900 });
    const s0 = await S(); const pb = p.locator('.gr-answer').last().locator('button', { hasText: /^Pay / }); await pb.dblclick().catch(() => {}); await p.waitForTimeout(500);
    const sb = p.locator('.app-sheet .gr-btn').last(); await sb.dblclick().catch(e => log('dbl', e.message.slice(0, 50))); await p.waitForSelector('.app-sheet', { state: 'detached', timeout: 8000 }).catch(() => {}); await p.waitForTimeout(800);
    s = await S(); log('double tap delta', s.balance - s0.balance, s.bookings.length - s0.bookings.length);
  });
})();
