const L = require('./lib.js');
(async () => {
  const h = await L('IN', { tag: 'otp' }); const { p, st, ask, last, btn, text, shot, sheetText } = h;
  await ask('Noise-cancelling headphones'); await last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(400); await last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(500);
  await btn(/^Pay /);
  const enter = async (code) => { const ins = await p.$$('.app-sheet input'); for (let i = 0; i < 6; i++) await ins[i].fill(code[i]); await p.waitForTimeout(200); const b = p.locator('.app-sheet .gr-btn').last(); if (!(await b.isDisabled())) await b.click(); await p.waitForTimeout(1500); console.log('after', code, ':', await sheetText()) };
  await enter('111111'); await shot('otp1'); await enter('222222'); await shot('otp2'); await enter('333333'); await shot('otp3');
  const s = await st(); console.log('pts', s.balance, 'bookings', s.bookings.length);
  await p.reload(); await p.waitForTimeout(800); await h.esc();
  await btn(/^Pay /).catch(e => console.log('no pay btn')); console.log('after reload sheet:', await sheetText()); await shot('otp-reload');
  // paste code into first box
  console.log('focus order / aria:', await p.evaluate(() => [...document.querySelectorAll('.app-sheet input')].map(i => (i.getAttribute('aria-label') || '') + ':' + i.inputMode + ':' + i.autocomplete).join(' | ')));
  console.log('ERRS', h.errs); await h.b.close();
})();
