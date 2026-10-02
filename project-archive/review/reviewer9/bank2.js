const H = require('./h.js');
(async () => {
  const m = process.argv[2] || 'IN';
  const h = await H.open(m, { tag: m + '-bank2' }); const { p, ask, btn, shot, st, last, sheetText } = h;
  const otp = async () => { const ins = await p.$$('.app-sheet input'); if (ins.length >= 6) { await ins[0].focus(); await p.keyboard.type('482193') } await p.locator('.app-sheet .gr-btn').last().click(); await p.waitForTimeout(3200) };
  await h.nav(3); await ask('What do I owe?'); await p.locator('.gr-answer').last().getByRole('radio', { name: /Another amount/ }).click(); await p.waitForTimeout(200); await shot('custom');
  const inp = p.locator('.gr-answer').last().locator('input'); console.log('custom inputs', await inp.count());
  if (await inp.count()) { await inp.first().fill('99999999'); await p.waitForTimeout(200); console.log('overpay:', (await last()).slice(-200).replace(/\n/g, ' | ')); await inp.first().fill('0.5'); await p.waitForTimeout(200); console.log('tiny:', (await last()).slice(-200).replace(/\n/g, ' | ')); await inp.first().fill('1500'); await p.waitForTimeout(200) }
  await shot('custom2'); await btn(/^Pay /); console.log('SHEET:', (await sheetText() || '').replace(/\n/g, ' | ')); await otp(); console.log('after:', (await last()).slice(0, 200).replace(/\n/g, ' | ')); let s = await st(); console.log('card', s.card.balance, s.card.due, s.txns[0].merchant, s.txns[0].amount);
  await btn(/Set up (Direct Debit|auto-?debit|standing|e-?mandate|.*)/i).catch(e => console.log('no dd btn')); console.log('DD SHEET:', (await sheetText() || 'none').replace(/\n/g, ' | ')); if (await sheetText()) await otp(); console.log('DD:', (await last()).slice(0, 200).replace(/\n/g, ' | '));
  await ask('freeze my card'); await ask('unfreeze my card'); console.log('UF SHEET:', (await sheetText() || 'none').replace(/\n/g, ' | ')); await otp(); s = await st(); console.log('frozen', s.card.frozen);
  await ask('turn off payments abroad'); await ask('turn payments abroad back on'); console.log('AB SHEET:', (await sheetText() || 'none').replace(/\n/g, ' | ')); await p.keyboard.press('Escape'); await p.waitForTimeout(300); s = await st(); console.log('abroad after esc', s.card.abroad);
  // toggle via switch
  const sw = p.locator('.gr-answer').last().locator('[role=switch]'); console.log('switches', await sw.count());
  if (await sw.count() > 2) { await sw.nth(2).click(); await p.waitForTimeout(400); console.log('switch sheet', !!(await sheetText())); await p.keyboard.press('Escape') }
  // subs
  await ask('Start a streaming subscription'); await p.locator('.gr-answer').last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(300); await p.locator('.gr-answer').last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(300); await btn(/^Card/, { role: 'radio' }).catch(() => {}); await btn(/^Pay /); await otp();
  await ask('pause my Screenly'); console.log('P:', (await last()).slice(0, 150).replace(/\n/g, ' | '));
  await ask('resume my Screenly'); console.log('R SHEET:', (await sheetText() || 'none').replace(/\n/g, ' | ')); await otp(); console.log('R:', (await last()).slice(0, 150).replace(/\n/g, ' | '));
  await ask('Start a streaming subscription'); await p.locator('.gr-answer').last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(300); console.log('dup detail:', (await last()).slice(0, 300).replace(/\n/g, ' | '));
  await ask('cancel my Screenly'); await btn('Yes, cancel'); console.log('C:', (await last()).slice(0, 200).replace(/\n/g, ' | ')); s = await st(); console.log(s.bookings.map(b => b.title + ':' + b.status).join(' / '), 'pts', s.balance, 'card', s.card.balance);
  console.log('ERR', await h.done());
})();
