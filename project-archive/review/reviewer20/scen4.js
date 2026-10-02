const L = require('./lib.js');
(async () => {
  const h = await L('UK', { tag: 'sc4' }); const { p, st, ask, last, btn, confirm, text, shot, nav, sheetText } = h;
  const log = async (tag) => { const s = await st(); console.log(tag, '| pts', s.balance, '| card', s.card.balance, '| bookings', s.bookings.map(b => `${b.title}:${b.status}:${b.total}`).join(' ; ')) };
  const demo = async (name) => { await nav(5); await p.getByRole('button', { name, exact: true }).click(); await p.waitForTimeout(800); await nav(3) };
  const buy = async (q, payOpt) => { await ask(q); await last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(400); await last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(500); if (payOpt) { await p.getByText(payOpt, { exact: true }).last().click(); await p.waitForTimeout(300) } await btn(/^Pay /); return await confirm() };
  await buy('Noise-cancelling headphones', 'Card'); await demo('Deliver my order'); await demo('Return window ends'); await log('ended');
  await ask('return my headphones'); console.log('late return:', (await text()).slice(0, 400)); await shot('late', true);
  await demo('Reset demo').catch(()=>{}); await p.waitForTimeout(500); await log('reset');
  await buy('Noise-cancelling headphones', 'Points and card'); await demo('Deliver my order'); await log('delivered');
  await ask('return my headphones'); await btn(/Book free collection/); await p.waitForTimeout(500); if (await sheetText()) { console.log('SHEET', await sheetText()); await confirm() }
  console.log('booked collection:', (await text()).slice(0, 400)); await log('returning');
  await p.waitForTimeout(20000); await p.reload(); await p.waitForTimeout(1000); await log('20s');
  await p.waitForTimeout(16000); await log('36s'); await nav(4); await p.getByRole('tab', { name: /Orders|Past/ }).last().click(); await p.waitForTimeout(300); console.log((await p.locator('.app-main').innerText()).replace(/\s+/g, ' ').slice(0, 500));
  await nav(3); console.log('chat tail:', (await text()).slice(0, 300));
  console.log('ERRS', h.errs); await h.b.close();
})();
