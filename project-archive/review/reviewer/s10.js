const open = require('./h.js');
(async () => {
  const H = await open('UK', 'light', 'test.html', 's9'); const { p } = H;
  await H.nav(4); await H.shot('wallet-empty');
  await H.nav(3);
  await H.ask('Rain shell jacket'); await H.pickItem(0); await H.detailCta();
  await p.locator('.gr-answer').last().getByText('Card', { exact: true }).last().click(); await p.waitForTimeout(200);
  await H.pay(); await H.confirm(); await p.waitForTimeout(2300);
  // mark delivered
  // claim flow on a new order
  await H.nav(3); await H.ask('Air fryer'); await H.pickItem(0); await H.detailCta(); await H.pay(); await H.confirm(); await p.waitForTimeout(2300);
  await H.nav(4); await H.btn('Report a problem'); console.log('CLAIM FORM:', (await H.last()).replace(/\n/g, ' | '));
  await p.locator('.gr-answer').last().getByRole('button', { name: 'It arrived damaged' }).click(); await p.locator('.gr-answer').last().getByRole('button', { name: /photo|Add/i }).first().click().catch(() => console.log('no upload btn'));
  await H.btn('Send claim'); console.log('CLAIM:', (await H.last()).replace(/\n/g, ' | ')); await H.bottom('claim');
  await H.nav(4); await p.getByRole('button', { name: 'Requests' }).click().catch(() => { }); await p.waitForTimeout(200); console.log('REQ2:', (await H.text()).replace(/\n/g, ' | ')); await H.tall('requests');
  // dining booking + cancel
  await H.nav(3); await H.ask('A table tonight for two'); await H.pickItem(0); await p.locator('.gr-slot').nth(3).click(); await H.detailCta(); console.log('DINE CONF:', (await H.last()).replace(/\n/g, ' | ')); await H.btn('Book the table'); console.log('DINE DONE:', (await H.last()).replace(/\n/g, ' | '));
  await H.nav(4); console.log('UPCOMING:', (await H.text()).replace(/\n/g, ' | '));
  await H.close();
})();
