const run = require('./h.js'); const el = run.el; const m = 'IN';
run(`otp-IN`, m, async h => {
  const { p, ask, last, lastText, btn, confirm, log, nav, state, sheetText, shot } = h;
  await nav(3);
  await ask('Noise-cancelling headphones'); await last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(300); await last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(300);
  log('CO', await lastText());
  await btn(/^Pay /); log('SHEET', await sheetText()); await shot('otp');
  for (let k = 0; k < 3; k++) {
    const ins = await p.$$('.app-sheet input'); if (ins.length >= 6) { for (let i = 0; i < 6; i++) await ins[i].fill('111111'[i]) } else await ins[0].fill('111111');
    await p.locator('.app-sheet .gr-btn').last().click().catch(e => log('btn fail')); await p.waitForTimeout(600); log('try' + k, await sheetText()); await shot('otp-try' + k);
  }
  await p.reload(); await p.waitForTimeout(800); await nav(3);
  await btn(/^Pay /).catch(e => log('no pay btn after reload')); log('after reload', await sheetText()); await shot('otp-reload');
  await p.keyboard.press('Escape'); await p.waitForTimeout(300);
  await ask('Freeze my card'); log('freeze', (await lastText()).slice(0, 200), await sheetText());
  const s = await state(); log('S', s.balance, s.card.balance, s.card.frozen);
}, {});
