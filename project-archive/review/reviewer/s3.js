const open = require('./h.js');
(async () => {
  const H = await open('UK', 'light', 'test.html', 's3'); const { p } = H;
  const toggle = async (i, on = true) => { await H.nav(5); const t = p.locator('.app-demo [role=switch]').nth(i); const st = await t.getAttribute('aria-checked'); if ((st === 'true') !== on) await t.click(); await p.waitForTimeout(200); await H.nav(3) };
  await H.nav(3);
  await H.ask('Freeze my card'); console.log('FREEZE:', (await H.last()).slice(0, 200));
  // pay by card while frozen
  await H.ask('Espresso machine'); await H.pickItem(0); await H.detailCta();
  console.log('CHK:', (await H.last()).slice(-300));
  await p.locator('.gr-answer').last().getByText('Card', { exact: true }).last().click(); await p.waitForTimeout(200);
  await H.pay(); await H.confirm(); await p.waitForTimeout(500); console.log('FROZEN PAY:', await H.last()); await H.bottom('frozenpay');
  await H.btn('Unfreeze card'); console.log('UNFREEZE BTN:', await H.last());
  await H.ask('unfreeze my card'); console.log('UNFREEZE CHAT:', await H.last()); let S = await H.state(); console.log('frozen?', S.card.frozen);
  // laptop 99,900 pts > balance
  await H.ask('13-inch laptop'); await H.pickItem(0); await H.detailCta(); console.log('LAPTOP CHK:', (await H.last()).slice(-350)); await H.bottom('laptop');
  // try clicking Points option when not enough
  await p.locator('.gr-answer').last().getByText('Points', { exact: true }).last().click().catch(e => console.log('pts click', e.message)); await p.waitForTimeout(200);
  console.log('PAY BTN:', await p.getByRole('button', { name: /^Pay / }).last().innerText());
  // supplier down: transfer points
  await toggle(1, true);
  S = await H.state(); const b0 = S.balance;
  await H.ask('Transfer points to miles'); await p.locator('.gr-answer').last().locator('.gr-ack input').first().check().catch(() => { }); await p.locator('.gr-answer').last().locator('.gr-btn').first().click(); await p.waitForTimeout(500);
  S = await H.state(); console.log('SUPPLIER DOWN TRANSFER:', await H.last(), '\n bal before', b0, 'after', S.balance, 'bookings', S.bookings.length);
  await H.ask('Donate points to charity'); await p.locator('.gr-answer').last().locator('.gr-btn').first().click(); await p.waitForTimeout(500);
  S = await H.state(); console.log('SUPPLIER DOWN DONATE:', await H.last(), '\n bal', S.balance);
  await H.ask('Book a lounge'); await H.pickItem(0); await H.detailCta(); console.log('LOUNGE:', (await H.last()).slice(-200)); await H.btn('Confirm', true); S = await H.state(); console.log('LOUNGE SUPPLIER DOWN:', await H.last(), 'loungeLeft', S.loungeLeft);
  await H.ask('A sold-out restaurant'); await p.fill('.app-ta', 'Sat 8pm'); await H.btn('Send to the concierge'); console.log('CONCIERGE DOWN:', await H.last());
  await H.bottom('supplierdown');
  await toggle(1, false);
  await H.close();
})();
