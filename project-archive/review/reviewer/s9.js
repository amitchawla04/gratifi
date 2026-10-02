const open = require('./h.js');
(async () => {
  const H = await open('UK', 'light', 'test.html', 's9'); const { p } = H;
  await H.nav(4); await H.shot('wallet-empty');
  await H.nav(3);
  await H.ask('Rain shell jacket'); await H.pickItem(0); await H.detailCta();
  await p.locator('.gr-answer').last().getByText('Card', { exact: true }).last().click(); await p.waitForTimeout(200);
  await H.pay(); await H.confirm(); await p.waitForTimeout(2300);
  // mark delivered
  await p.evaluate(() => { const k = 'gratifi-state-v3-UK'; const s = JSON.parse(localStorage.getItem(k)); s.bookings[0].status = 'delivered'; s.bookings[0].tracker.current = 3; localStorage.setItem(k, JSON.stringify(s)) });
  await p.reload(); await p.waitForTimeout(600);
  let S = await H.state(); console.log('before return card', S.card.balance, 'pts', S.balance);
  await H.nav(4); console.log('WALLET:', (await H.text()).replace(/\n/g, ' | '));
  await p.getByRole('button', { name: 'Orders' }).click().catch(() => { }); await p.waitForTimeout(200);
  await H.btn('Return', true); console.log('RETURN:', (await H.last()).replace(/\n/g, ' | ')); await H.bottom('return');
  const b = p.getByRole('button', { name: 'Book free collection' });
  await b.last().click(); await p.waitForTimeout(400); S = await H.state(); console.log('after 1st card', S.card.balance);
  console.log('btn still there:', await b.count());
  if (await b.count()) { await b.last().click(); await p.waitForTimeout(400); S = await H.state(); console.log('after 2nd card', S.card.balance) }
  await H.bottom('return2');
  // report problem on delivered -> claim
  await H.nav(4); await p.getByRole('button', { name: 'Past' }).click().catch(() => { }); await p.waitForTimeout(200); console.log('PAST:', (await H.text()).replace(/\n/g, ' | '));
  await H.nav(4); await p.getByRole('button', { name: 'Requests' }).click().catch(() => { }); await p.waitForTimeout(200); console.log('REQ:', (await H.text()).replace(/\n/g, ' | '));
  // claim flow on a new order
  await H.nav(3); await H.ask('Air fryer'); await H.pickItem(0); await H.detailCta(); await H.pay(); await H.confirm(); await p.waitForTimeout(2300);
  await H.btn("Something's wrong"); console.log('CLAIM FORM:', (await H.last()).replace(/\n/g, ' | '));
  await p.locator('.gr-answer').last().getByRole('button', { name: 'It arrived damaged' }).click(); await p.locator('.gr-answer').last().getByRole('button', { name: /photo|Add/i }).first().click().catch(() => console.log('no upload btn'));
  await H.btn('Send claim'); console.log('CLAIM:', (await H.last()).replace(/\n/g, ' | ')); await H.bottom('claim');
  await H.nav(4); await p.getByRole('button', { name: 'Requests' }).click().catch(() => { }); await p.waitForTimeout(200); console.log('REQ2:', (await H.text()).replace(/\n/g, ' | ')); await H.tall('requests');
  // dining booking + cancel
  await H.nav(3); await H.ask('A table tonight for two'); await H.pickItem(0); await p.locator('.gr-slot').nth(3).click(); await H.detailCta(); console.log('DINE CONF:', (await H.last()).replace(/\n/g, ' | ')); await H.btn('Book the table'); console.log('DINE DONE:', (await H.last()).replace(/\n/g, ' | '));
  await H.nav(4); console.log('UPCOMING:', (await H.text()).replace(/\n/g, ' | '));
  await H.close();
})();
