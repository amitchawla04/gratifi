const { run } = require('./lib.js');
run('IN-otp', 'IN', async (H) => {
  const { p } = H;
  await H.nav(3); await H.ask('A hotel in Goa with a pool'); 
  await p.locator('.gr-answer').last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(400);
  await H.full('detail');
  await p.locator('.gr-answer').last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(400);
  await H.full('checkout');
  const m0 = await H.money(); H.log('before', JSON.stringify(m0));
  await H.click(/^Pay /); await p.waitForTimeout(300); await H.shot('sheet');
  for (let k = 0; k < 3; k++) { const ins = await p.$$('.app-sheet input'); for (let i = 0; i < ins.length; i++) await ins[i].fill('111111'[i] || ''); if (ins.length === 1) await ins[0].fill('111111'); await p.locator('.app-sheet .gr-btn').last().click().catch(()=>{}); await p.waitForTimeout(700); await H.shot('wrong' + k); H.log('sheet after wrong', k, JSON.stringify(await H.sheetText())); }
  const m1 = await H.money(); H.log('after wrong', JSON.stringify(m1));
  await p.reload(); await p.waitForTimeout(800); await H.nav(3); await H.full('after-reload');
  // try paying again
  const pay = p.getByRole('button', { name: /^Pay / }); H.log('pay buttons', await pay.count());
  if (await pay.count()) { await pay.last().click(); await p.waitForTimeout(500); await H.shot('sheet-locked'); H.log('locked sheet', JSON.stringify(await H.sheetText())); }
  await p.waitForTimeout(2500); H.log('locked sheet 2', JSON.stringify(await H.sheetText()));
  // Try another money action while locked: pay bill
  await p.keyboard.press('Escape'); await p.waitForTimeout(300);
  await H.ask('pay my bill'); await H.full('paybill');
  const pb = p.getByRole('button', { name: /^Pay / }); if (await pb.count()) { await pb.last().click(); await p.waitForTimeout(500); H.log('paybill sheet', JSON.stringify(await H.sheetText())); await H.shot('paybill-sheet'); }
  // jump clock 16 mins
  await p.evaluate(() => { const k = Object.keys(localStorage); return k }).then(k => H.log('keys', k.join(',')));
});
