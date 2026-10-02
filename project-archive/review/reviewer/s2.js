const open = require('./h.js');
(async () => {
  const H = await open('UK', 'light', 'test.html', 's2'); const { p } = H;
  await H.nav(3);
  await H.ask('Flights to Barcelona next weekend for two');
  await p.locator('.gr-flight').first().click(); await p.waitForTimeout(400);
  console.log('FARE SAY:', (await H.last()).slice(0, 400));
  await H.btn(/Continue with/);
  await p.locator('.gr-answer').last().locator('[aria-label^="Seat 16A"]').click(); await p.waitForTimeout(200);
  await p.locator('.gr-answer').last().getByRole('button', { name: /increase|more|\+/i }).first().click().catch(e => console.log('no plus', e.message));
  await H.shot('seatsA');
  await H.btn('Continue', true);
  console.log('CHECKOUT:', await H.last());
  await H.bottom('checkout');
  await H.pay(); await H.confirm(); await p.waitForTimeout(2300);
  console.log('RECEIPT:', await H.last());
  let S = await H.state(); const bk = S.bookings[0]; console.log('BOOKING', JSON.stringify({ total: bk.total, pts: bk.pts, card: bk.card, detail: bk.detail, extra: bk.extra }));
  console.log('bal', S.balance);
  // pass
  await H.nav(4); console.log('WALLET:', await H.text());
  await H.btn('Show pass'); await H.bottom('pass');
  await H.nav(4); await H.btn('Change date'); console.log('CHANGE:', await H.last()); await H.bottom('change');
  // try buttons in change card
  const cbtns = await p.locator('.gr-answer').last().getByRole('button').allInnerTexts(); console.log('change buttons', cbtns);
  if (cbtns.length) { await p.locator('.gr-answer').last().getByRole('button').last().click(); await p.waitForTimeout(500); console.log('AFTER CHANGE BTN:', await H.lastN(2)); await H.bottom('change2') }
  await H.ask('Cancel my flight'); console.log('CANCEL MY FLIGHT:', (await H.last()).slice(0, 300));
  await H.ask('cancel my booking to Barcelona'); console.log('CANCEL BCN:', (await H.last()).slice(0, 300));
  await H.nav(4); await H.btn('Cancel', true); console.log('WALLET CANCEL:', await H.last()); await H.bottom('cancelflight');
  await H.btn('Yes, cancel'); S = await H.state(); console.log('after cancel bal', S.balance, 'card', S.card.balance, S.bookings[0].status); console.log(await H.last());
  await H.close();
})();
