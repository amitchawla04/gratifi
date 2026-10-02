const { run } = require('./lib.js');
run('UK-ref', 'UK', async (H) => {
  const { p } = H;
  await H.nav(3); await H.ask('flights to Lisbon 14 Oct back 18 Oct for two'); await p.locator('.gr-flight').first().click(); await p.waitForTimeout(400); await H.click(/Continue with/);
  await p.locator('.gr-answer').last().locator('input.app-in').nth(1).fill('Sam Taylor'); await H.click('Continue', { exact: true });
  await p.locator('.gr-answer').last().getByRole('radio', { name: /^Card/ }).or(p.locator('.gr-answer').last().getByRole('button', { name: /^Card/ })).first().click().catch(e => H.log('radio fail', e.message.slice(0, 80)));
  await p.waitForTimeout(300); await H.click(/^Pay /); await H.confirm();
  H.log('m0', JSON.stringify(await H.money()), (await H.st()).bookings[0].earned);
  // spend all points: donate
  const bal = (await H.st()).balance; H.log('bal', bal);
  await H.ask(`give ${bal} points to Clean Seas`); await H.full('donate'); H.log('donate', (await H.last()).text);
  if (!(await p.$('.app-sheet')) && await H.has(/^(Give|Donate)/)) { await H.click(/^(Give|Donate)/); }
  if (await p.$('.app-sheet')) await H.confirm();
  H.log('m1', JSON.stringify(await H.money()));
  await H.nav(5); await H.click('Cancel my next flight'); await H.nav(4);
  await H.click('Full refund'); await p.waitForTimeout(400); await H.full('refund-ask');
  H.log('ask', (await H.lastText()).slice(0, 600), 'sheet', await H.sheetText());
  if (await p.$('.app-sheet')) await H.confirm(); else if (await H.has(/Yes, cancel|Yes, refund|Refund in full|Confirm/)) { await H.click(/Yes, cancel|Yes, refund|Refund in full|Confirm/); if (await p.$('.app-sheet')) await H.confirm(); }
  await H.full('refunded'); H.log('done', (await H.last()).text);
  H.log('m2', JSON.stringify(await H.money()));
  const s = await H.st(); H.log('ledger', JSON.stringify(s.ledger.slice(0, 5).map(l => [l.label, l.pts])), JSON.stringify(s.txns.slice(0, 3).map(t => [t.merchant, t.amount, t.refund])));
  // second cancel attempt via chat & old button
  await H.ask('cancel my Lisbon flight'); H.log('again', (await H.last()).text);
  const y = p.getByRole('button', { name: /Yes, cancel|Yes, refund/ }); H.log('live yes buttons', await y.count());
});
