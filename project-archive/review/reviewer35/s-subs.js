const { open } = require('./h.js');
(async () => {
  const h = await open({ market: 'UK', tag: 'subs' });
  const { p, full, nav, ask, click, confirm, log, errs, shot, lastText, state } = h;
  const A = async (q) => { if (await p.$('.app-sheet')) { await p.keyboard.press('Escape'); await p.waitForTimeout(400) } await ask(q, 900); log('\n> ' + q + '\n  ' + (await lastText()).slice(0, 600)); if (await p.$('.app-sheet')) log('  SHEET ' + await h.sheetText()) };
  try {
    await nav(3); await A('Start Screenly'); 
    const b = p.locator('.gr-answer').last().locator('.gr-btn:not([disabled])').last(); log('btn', await b.innerText()); await b.click(); await p.waitForTimeout(400); log('  ' + (await lastText()).slice(0, 500));
    await click(/^Pay /); log('SHEET', await confirm()); log('  DONE ' + (await lastText()).slice(0, 400));
    await A('what am I paying for'); await A("what's included"); await A('pause Screenly'); await A('resume it'); await confirm(); log('  RESUMED ' + (await lastText()).slice(0,300)); await A('cancel Screenly');
    const y = p.getByRole('button', { name: /Yes, cancel/ }); if (await y.count()) { await y.last().click(); await p.waitForTimeout(600); log('  CANCELLED ' + (await lastText()).slice(0, 400)) }
    await A('start Tunewave');
    const b2 = p.locator('.gr-answer').last().locator('.gr-btn:not([disabled])').last(); if (await b2.count()) { log('btn2', await b2.innerText()); await b2.click(); await p.waitForTimeout(500); log('  ' + (await lastText()).slice(0, 400)); if (await p.$('.app-sheet')) log('SHEET', await confirm()) }
    await A('what subscriptions do I have');
    await nav(4); await click('Subscriptions'); await full('wallet-subs');
    const s = await state(); log(JSON.stringify(s.bookings.map(b => [b.title, b.status, b.extra])), s.card.balance);
  } catch (e) { log('FAIL', e.message.split('\n')[0]); await shot('fail') }
  log('errs', errs); await h.b.close();
})();
