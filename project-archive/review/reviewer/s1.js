const open = require('./h.js');
(async () => {
  const H = await open('UK', 'light', 'test.html', 's1'); const { p } = H;
  await p.evaluate(()=>0);
  await H.nav(3);
  // shopping: headphones by card only
  await H.ask('Noise-cancelling headphones'); console.log('LIST:', await H.last());
  await H.pickItem(0); await H.detailCta(); console.log('CHECKOUT:', await H.last());
  // choose card
  await p.locator('.gr-answer').last().getByText('Card', { exact: true }).last().click().catch(e => console.log('no card opt', e.message));
  await p.waitForTimeout(300);
  await H.pay(); await H.shot('sheet'); await H.confirm(); await p.waitForTimeout(2200);
  let S = await H.state(); console.log('after buy bal', S.balance, 'card', S.card.balance, 'ledger', JSON.stringify(S.ledger.slice(0, 3)));
  console.log('RECEIPT:', await H.last());
  // return via chat
  await H.nav(4); await H.shot('wallet');
  console.log('WALLET:', await H.text());
  await H.btn('Track'); console.log('TRACK:', await H.last());
  // Return path requires delivered; try manage via chat "return"
  await H.ask('I want to return the headphones'); console.log('RET ASK:', await H.last());
  // cancel it
  await H.ask('cancel it'); console.log('CANCEL IT:', await H.last()); await H.bottom('cancelit');
  const yes = p.getByRole('button', { name: 'Yes, cancel' });
  if (await yes.count()) { await yes.last().click(); await p.waitForTimeout(500); S = await H.state(); console.log('after cancel1 bal', S.balance, 'card', S.card.balance); await yes.last().click(); await p.waitForTimeout(500); S = await H.state(); console.log('after cancel2 bal', S.balance, 'card', S.card.balance); console.log('LAST:', await H.lastN(2)); }
  await H.bottom('aftercancel');
  await H.close();
})();
