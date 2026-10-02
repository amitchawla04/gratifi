const open = require('./h.js');
(async () => {
  const H = await open('IN', 'light', 'test.html', 's5'); const { p } = H;
  await H.nav(3);
  await H.ask('Noise-cancelling headphones'); await H.pickItem(0); await H.detailCta();
  await p.locator('.gr-answer').last().getByText('Card', { exact: true }).last().click(); await p.waitForTimeout(200);
  await H.pay();
  const ins = await p.$$('.app-sheet input'); console.log('inputs', ins.length);
  const btn = p.locator('.app-sheet .gr-btn').last(); console.log('btn disabled before code?', await btn.isDisabled(), await btn.innerText());
  await H.shot('otp-empty');
  // try confirming with empty code
  await btn.click({ timeout: 2000 }).catch(e => console.log('click empty failed', e.message.split('\n')[0])); await p.waitForTimeout(500);
  console.log('sheet after empty click?', !!(await p.$('.app-sheet')));
  if (await p.$('.app-sheet')) { const ins2 = await p.$$('.app-sheet input'); for (let i = 0; i < 6; i++) await ins2[i].fill('000000'[i]); await H.shot('otp-wrong-typed'); console.log('disabled after wrong', await btn.isDisabled().catch(() => 'n/a')); await btn.click({ timeout: 2000 }).catch(e => console.log('click wrong failed')); await p.waitForTimeout(300); await H.shot('otp-wrong-after'); console.log('SHEET TEXT', (await H.text('.app-sheet')).replace(/\n/g, ' | ')); await p.waitForTimeout(2300) }
  const S = await H.state(); console.log('bookings', S.bookings.length, 'card', S.card.balance);
  await H.close();
})();
