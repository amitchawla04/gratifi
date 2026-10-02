const { open } = require('./h.js');
(async () => {
  const h = await open({ market: 'IN', tag: 'otp' });
  const { p, full, nav, ask, click, log, errs, shot, state } = h;
  const tryCode = async (code) => { const ins = await p.$$('.app-sheet input'); for (let i = 0; i < 6; i++) await ins[i].fill(code[i]); await p.locator('.app-sheet .gr-btn').last().click().catch(e => log('btn disabled?')); await p.waitForTimeout(900); log('after', code, (await h.sheetText()) || 'SHEET CLOSED') };
  try {
    await nav(3); await ask('Milk, eggs and bread'); await click('Checkout'); await click(/^Pay /);
    await shot('otp0');
    await tryCode('111111'); await shot('otp1'); await tryCode('222222'); await shot('otp2'); await tryCode('333333'); await shot('otp3');
    await p.keyboard.press('Escape'); await p.waitForTimeout(300);
    await click(/^Pay /).catch(e => log('pay click fail')); await shot('otp-after-lock'); log('REOPEN', await h.sheetText());
    await p.reload(); await p.waitForTimeout(800); await nav(3);
    await click(/^Pay /).catch(e => log('pay click fail after reload')); await shot('otp-reload'); log('AFTER RELOAD', await h.sheetText());
    await p.keyboard.press('Escape');
    await ask('freeze my card'); await ask('unfreeze my card'); log('UNFREEZE', await h.sheetText()); await shot('unfreeze-locked');
    const s = await state(); log('state', s.card.balance, s.balance, s.bookings.length);
  } catch (e) { log('FAIL', e.message.split('\n')[0]); await shot('fail') }
  log('errs', errs); await h.b.close();
})();
