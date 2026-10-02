const L = require('./lib.js');
(async () => {
  const h = await L('UK', { tag: 'sc5' }); const { p, st, ask, last, btn, confirm, text, shot, nav, sheetText } = h;
  const log = async (tag) => { const s = await st(); console.log(tag, '| pts', s.balance, '| card', s.card.balance, '| bookings', s.bookings.map(b => `${b.title}:${b.status}:${b.total}:pts=${b.pts}:card=${b.card}:earned=${b.earned}:${b.when}`).join(' ; ')) };
  await ask('Flights to Lisbon from 12 to 15 October'); await p.locator('.gr-flight').first().click(); await p.waitForTimeout(500);
  await btn(/^Continue with/); await btn('Continue', null, true);
  // choose points and card default
  await btn(/^Pay /); console.log(await confirm()); await log('booked');
  await ask('change the date of my flight'); console.log('CHG:', (await text()).slice(0, 500)); await shot('chg1', true);
  // pick a new outbound date: click a date chip 'Wed 14 Oct'
  await p.getByRole('button', { name: /Wed 14 Oct/ }).last().click().catch(e => console.log('nochip')); await p.waitForTimeout(600);
  console.log('CHG2:', (await text()).slice(0, 700)); await shot('chg2', true);
  const opt = last().locator('.gr-flight, .gr-itemrow, [role=radio]').first(); if (await opt.count()) { await opt.click(); await p.waitForTimeout(500) }
  const go = p.getByRole('button', { name: /^(Move|Change|Pay|Confirm|Switch)/ }).last(); console.log('go btn', await go.count() ? await go.innerText() : 'none');
  if (await go.count()) { await go.click(); await p.waitForTimeout(600); console.log('SHEET', await sheetText()); if (await sheetText()) console.log(await confirm()); }
  console.log('CHG3:', (await text()).slice(0, 600)); await log('changed'); await shot('chg3', true);
  await ask('cancel my flight'); console.log('CAN:', (await text()).slice(0, 500)); await btn(/^Yes, cancel/); await p.waitForTimeout(400); if (await sheetText()) { console.log('SHEET', await sheetText()); await confirm() }
  console.log('CAN2:', (await text()).slice(0, 500)); await log('cancelled');
  const s = await st(); console.log('ledger', JSON.stringify(s.ledger.slice(0, 6))); console.log('txns', JSON.stringify(s.txns.slice(0, 4)));
  console.log('ERRS', h.errs); await h.b.close();
})();
