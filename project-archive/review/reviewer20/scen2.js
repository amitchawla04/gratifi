const L = require('./lib.js');
(async () => {
  const h = await L('UK', { tag: 'sc2' }); const { p, st, ask, last, btn, confirm, text, shot, nav, sheetText } = h;
  const log = async (tag) => { const s = await st(); console.log(tag, '| pts', s.balance, '| card', s.card.balance, '| bookings', s.bookings.map(b => `${b.title}:${b.status}:${b.total}:${JSON.stringify(b.paid||b.pay||'')}`).join(' ; ')) };
  const sw = async (name) => { await nav(5); await p.getByRole('switch', { name }).click(); await p.waitForTimeout(200); await nav(3) };
  const demo = async (name) => { await nav(5); await p.getByRole('button', { name, exact: true }).click(); await p.waitForTimeout(800); await nav(3) };
  const buy = async (q, payOpt) => { await ask(q); await last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(400); await last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(500); if (payOpt) { await p.getByText(payOpt, { exact: true }).last().click(); await p.waitForTimeout(300) } await btn(/^Pay /); const c = await confirm(); return c };
  await sw('Supplier is down');
  console.log('buy while down:', await buy('Noise-cancelling headphones')); console.log('  ', (await text()).slice(0, 300)); await shot('down', true); await log('down');
  await sw('Supplier is down');
  // card payment demo
  await demo('A card payment'); await log('cardpay');
  // buy with card, earn points; then spend points; then cancel the card purchase
  console.log('buy by card:', await buy('Noise-cancelling headphones', 'Card')); console.log('  ', (await text()).slice(-250)); await log('bought-card');
  // now spend almost all points on gift cards
  const s0 = await st(); console.log('points now', s0.balance);
  await ask('Cancel my headphones order'); console.log('cancel ask:', (await text()).slice(0, 400)); await shot('cancel-ask', true);
  const yes = p.getByRole('button', { name: /^Yes, cancel|Cancel order|Cancel for/ }).last(); if (await yes.count()) { await yes.click(); await p.waitForTimeout(600); console.log('SHEET', await sheetText()); await confirm(); }
  console.log('cancel done:', (await text()).slice(0, 400)); await log('cancelled');
  // deliver and return flow
  console.log('buy2:', await buy('Noise-cancelling headphones', 'Card')); await demo('Deliver my order'); await log('delivered');
  await nav(4); await p.getByRole('button', { name: 'Orders', exact: false }).first().click(); await p.waitForTimeout(400); await shot('wallet-orders', true);
  console.log('wallet:', (await p.locator('.app-main').innerText()).replace(/\s+/g, ' ').slice(0, 600));
  const ret = p.getByRole('button', { name: /Return/ }).first(); if (await ret.count()) { await ret.click(); await p.waitForTimeout(600); console.log('after return click:', (await p.locator('.app-main').innerText()).replace(/\s+/g, ' ').slice(0, 500)); console.log('SHEET', await sheetText()); }
  await shot('return1', true);
  console.log('ERRS', h.errs); await h.b.close();
})();
