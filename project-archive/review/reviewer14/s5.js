const { run } = require('./lib.js'); const book = require('./s3.js');
run('UK-dis', 'UK', async (H) => {
  const { p } = H;
  await H.nav(3); await book(H, 'flights to Lisbon 14 Oct back 18 Oct for two');
  const m0 = await H.money(); H.log('m0', JSON.stringify(m0));
  await H.nav(5); await H.click('Cancel my next flight'); await H.full('dis');
  H.log('A', (await H.last()).text);
  // Path: wallet
  await H.nav(4); await H.full('wallet');
  H.log('wallet', (await p.locator('.app-main').innerText()).slice(0, 600));
  // free text
  await H.nav(3); await H.ask('my flight got cancelled, what now?'); await H.full('ft'); H.log('B', (await H.last()).text, (await H.last()).kinds);
  await H.ask('I just want my money back'); await H.full('ft2'); H.log('C', (await H.last()).text, (await H.last()).kinds);
  await H.ask('change my seat'); H.log('D', (await H.last()).text);
  await H.ask('show my boarding pass'); H.log('E', (await H.last()).text);
  // take the refund
  if (await H.has(/Yes, (cancel|refund)|Refund/)) { await H.click(/Yes, (cancel|refund)|Refund/); if (await p.$('.app-sheet')) await H.confirm(); }
  await H.full('refunded'); H.log('F', (await H.last()).text);
  const m1 = await H.money(); H.log('m1', JSON.stringify(m1));
  // second cancel attempt
  await H.ask('cancel my flight'); H.log('G', (await H.last()).text);
  // old buttons
  const olds = p.getByRole('button', { name: /Move to this flight|Full refund/ }); H.log('old buttons', await olds.count(), await olds.evaluateAll(es => es.map(e => e.disabled || e.closest('fieldset')?.disabled)));
  if (await olds.count()) { await olds.first().click({ force: true }).catch(() => {}); await p.waitForTimeout(500); H.log('after old click', (await H.last()).text); }
  H.log('m2', JSON.stringify(await H.money()));
  const s = await H.st(); H.log('ledger', JSON.stringify(s.ledger.slice(0, 5).map(l => [l.label, l.pts])), JSON.stringify(s.txns.slice(0, 3).map(t => [t.merchant, t.amount, t.refund])));
});
