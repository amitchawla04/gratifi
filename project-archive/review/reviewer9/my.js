const H = require('./h.js');
(async () => {
  const h = await H.open(process.argv[2] || 'MY', { tag: (process.argv[2] || 'MY') + '-app' }); const { p, ask, btn, shot, st, sheetText } = h;
  await h.nav(3); await ask('Milk, eggs and bread'); await btn('Checkout'); await btn(/^Card/, { role: 'radio' });
  const s0 = await st(); console.log('before', s0.balance, s0.card.balance, s0.bookings.length);
  await btn(/^Pay /); await btn(/Approve|Face ID|Confirm/, { w: 600 }); await shot('waiting'); console.log('WAIT:', await sheetText());
  await p.keyboard.press('Escape'); await p.waitForTimeout(3500);
  const s1 = await st(); console.log('after esc during wait', s1.balance, s1.card.balance, s1.bookings.length, 'sheet', await sheetText());
  await btn(/^Pay /); await btn(/Approve|Face ID|Confirm/, { w: 3000 }); await shot('done'); console.log('DONE:', await sheetText());
  await p.waitForTimeout(2500); await shot('chat');
  const s2 = await st(); console.log('after', s2.balance, s2.card.balance, s2.bookings.length, JSON.stringify(s2.txns[0]), JSON.stringify(s2.ledger.slice(0,2)));
  // dining times
  await ask('A table tonight for two'); console.log((await h.last()).slice(0, 400));
  await ask('A ride tomorrow at 7am to the airport'); console.log((await h.last()).slice(0, 400));
  console.log('ERR', await h.done());
})();
