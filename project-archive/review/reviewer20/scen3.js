const L = require('./lib.js');
(async () => {
  const h = await L('UK', { tag: 'sc3' }); const { p, st, ask, last, btn, confirm, text, shot, nav, sheetText } = h;
  const log = async (tag) => { const s = await st(); console.log(tag, '| pts', s.balance, '| card', s.card.balance, '| bookings', s.bookings.map(b => `${b.title}:${b.status}:${b.total}`).join(' ; ')) };
  const demo = async (name) => { await nav(5); await p.getByRole('button', { name, exact: true }).click(); await p.waitForTimeout(800); await nav(3) };
  const buy = async (q, payOpt) => { await ask(q); await last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(400); await last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(500); if (payOpt) { await p.getByText(payOpt, { exact: true }).last().click(); await p.waitForTimeout(300) } await btn(/^Pay /); return await confirm() };
  await buy('Noise-cancelling headphones', 'Card'); await log('bought');
  await ask('donate 48400 points to Warm Homes'); console.log('SHEET', await sheetText()); await confirm(); await log('donated');
  await ask('Cancel my headphones order'); console.log('ask:', (await text()).slice(0, 400));
  await btn(/^Yes, cancel/); await p.waitForTimeout(400); if (await sheetText()) { console.log('SHEET', await sheetText()); await confirm() }
  console.log('done:', (await text()).slice(0, 400)); await log('cancelled');
  // Deliver + return
  await buy('Noise-cancelling headphones', 'Card'); await demo('Deliver my order'); await log('delivered');
  await ask('return my headphones'); console.log('return ask:', (await text()).slice(0, 400)); await shot('ret-ask', true);
  const b1 = p.getByRole('button', { name: /^(Start the return|Return it|Yes, return|Return)/ }).last(); if (await b1.count()) { await b1.click(); await p.waitForTimeout(600); if (await sheetText()) { console.log('SHEET', await sheetText()); await confirm() } console.log('return started:', (await text()).slice(0, 400)); }
  await log('returning'); await p.waitForTimeout(33000); await p.reload(); await p.waitForTimeout(1500); await log('after33s');
  await nav(4); const tabs = await p.getByRole('tab').allInnerTexts(); console.log('tabs', tabs);
  await p.getByRole('tab', { name: /Orders/ }).click().catch(() => {}); await p.waitForTimeout(400); console.log('orders:', (await p.locator('.app-main').innerText()).replace(/\s+/g, ' ').slice(0, 500)); await shot('orders', true);
  // Return window ends then try return on another delivered order
  await nav(3); await buy('Noise-cancelling headphones', 'Card'); await demo('Deliver my order'); await demo('Return window ends');
  await ask('return my headphones'); console.log('late return:', (await text()).slice(0, 400));
  console.log('ERRS', h.errs); await h.b.close();
})();
