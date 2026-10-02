const H = require('./h.js');
(async () => {
  await H.run('otp2', { m: 'IN' }, async (h) => { const { p, nav, ask, click, log, sheet } = h; await nav(3);
    await ask('Milk, eggs and bread', 1000); await click('Checkout', { exact: true, w: 900 }); await click(/^Pay /, { w: 700 });
    for (let k = 0; k < 3; k++) { const ins = await p.$$('.app-sheet input'); for (let i = 0; i < 6; i++) await ins[i].fill('1'); await p.locator('.app-sheet .gr-btn').last().click().catch(() => {}); await p.waitForTimeout(800); }
    log('t0', (await sheet()).match(/Try again[^.]*/)?.[0]);
    await p.waitForTimeout(65000); log('t65', (await sheet()).match(/Try again[^.]*/)?.[0]);
    await p.keyboard.press('Escape'); await p.waitForTimeout(400);
    await ask('pay my bill', 1000); await click(/^Pay /, { w: 700 }); log('other flow sheet', (await sheet() || '').match(/Too many[^|]*|Enter the[^|]*/g));
  });
})();
