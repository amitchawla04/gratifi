const open = require('./h.js');
const mk = process.argv[2] || 'IN';
(async () => {
  const H = await open(mk, 'light', 'test.html', 's4'); const { p } = H;
  const city = { IN: 'Goa', MY: 'Penang', AE: 'Muscat', SG: 'Bali', EU: 'Rome' }[mk];
  await H.nav(3);
  // 1 flight
  await H.ask(`Flights to ${city} on 16 Oct`); console.log('FL SAY:', (await H.last()).split('\n').slice(2, 3).join(''));
  console.log('FL CARDS:', (await H.last()).split('\n').slice(3, 20).join(' | '));
  await p.locator('.gr-flight').first().click(); await p.waitForTimeout(400);
  console.log('FARES:', (await H.last()).replace(/\n/g, ' | ').slice(0, 700));
  await H.btn(/Continue with/); await H.btn('Continue', true);
  console.log('FL CHK:', (await H.last()).replace(/\n/g, ' | '));
  await H.pay(); await H.shot('sheet1');
  // wrong OTP first
  if (mk === 'IN') {
    const ins = await p.$$('.app-sheet input'); console.log('otp inputs', ins.length);
    if (ins.length >= 6) { for (let i = 0; i < 6; i++) await ins[i].fill('111111'[i]) } else if (ins.length) await ins[0].fill('111111');
    await p.locator('.app-sheet .gr-btn').last().click(); await p.waitForTimeout(800); await H.shot('wrongotp');
    console.log('after wrong otp sheet?', !!(await p.$('.app-sheet')), (await H.text('.app-sheet')).replace(/\n/g, ' | '));
    await p.waitForTimeout(2300); const S1 = await H.state(); console.log('WRONG OTP RESULT bookings', S1.bookings.length, 'bal', S1.balance); console.log('LAST', (await H.last()).replace(/\n/g,' | ').slice(0,300));
  } else { await H.confirm(); await p.waitForTimeout(2300); }
  console.log('FL RECEIPT:', (await H.last()).replace(/\n/g, ' | '));
  let S = await H.state(); console.log('bal', S.balance, 'card', S.card.balance);
  // 2 dining
  await H.ask('A table tonight for two'); console.log('DINE LIST:', (await H.last()).replace(/\n/g, ' | ').slice(0, 500));
  // 3 grocery
  await H.ask('Milk, eggs and rice'); console.log('GROC:', (await H.last()).replace(/\n/g, ' | ').slice(0, 600));
  await H.btn('Checkout'); await p.locator('.gr-answer').last().getByText('Card', { exact: true }).last().click(); await p.waitForTimeout(200);
  await H.pay(); await H.shot('sheet2'); console.log('SHEET2:', (await H.text('.app-sheet')).replace(/\n/g, ' | ')); await H.confirm(); await p.waitForTimeout(2300);
  console.log('GROC RECEIPT:', (await H.last()).replace(/\n/g, ' | '));
  // 4 gift card
  await H.ask('A gift card for a friend'); await H.pickItem(1); await p.fill('.app-in', 'Priya'); console.log('GIFT DETAIL:', (await H.last()).replace(/\n/g, ' | '));
  await H.detailCta(); await p.locator('.gr-answer').last().getByText('Points and card', { exact: true }).last().click(); await p.waitForTimeout(200);
  console.log('GIFT CHK:', (await H.last()).replace(/\n/g, ' | '));
  await H.pay(); await H.shot('sheet3'); await H.confirm(); await p.waitForTimeout(2300);
  console.log('GIFT RECEIPT:', (await H.last()).replace(/\n/g, ' | '));
  // 5 event with +£ option
  await H.ask('Concerts this month'); await H.pickItem(0); console.log('EVENT:', (await H.last()).replace(/\n/g, ' | '));
  await p.locator('.gr-answer').last().getByRole('button', { name: /lower/ }).click().catch(e => console.log('no lower')); await p.waitForTimeout(200); console.log('EVENT lower price:', (await H.last()).replace(/\n/g, ' | ').slice(-120));
  // insurance / subs / restaurants text
  await H.ask('Travel insurance'); console.log('INS:', (await H.last()).replace(/\n/g, ' | '));
  await H.ask('What subscriptions come with my card?'); await H.pickItem(0); console.log('SUB:', (await H.last()).replace(/\n/g, ' | '));
  await H.ask('Book a lounge'); console.log('LOUNGE:', (await H.last()).replace(/\n/g, ' | ').slice(0, 500));
  await H.ask('A ride now'); console.log('RIDES:', (await H.last()).replace(/\n/g, ' | ').slice(0, 700));
  await H.ask('Hotel in ' + city); console.log('HOTEL:', (await H.last()).replace(/\n/g, ' | ').slice(0, 500));
  await H.ask('Put points into gold'); console.log('GOLD:', (await H.last()).replace(/\n/g, ' | ').slice(0, 700));
  await H.ask('Ways to earn more'); console.log('CHAL:', (await H.last()).replace(/\n/g, ' | '));
  await H.ask('What does my card cover?'); console.log('BEN:', (await H.last()).replace(/\n/g, ' | '));
  await H.nav(1); console.log('HOME:', (await H.text()).replace(/\n/g, ' | '));
  await H.close();
})();
