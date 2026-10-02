const H = require('./h.js');
(async () => {
  const h = await H.open('UK', { tag: 'UK-fl' }); const { p, ask, btn, shot, st, last, sheetText } = h;
  const sum = async (l) => { const s = await st(); console.log(l, '| pts', s.balance, 'card', s.card.balance, 'lounge', s.loungeLeft, 'chl', s.challenges.map(c => c.progress + '/' + c.target + (c.joined ? 'J' : '') + (c.done ? 'D' : '')).join(','), '| bk', s.bookings.map(b => `${b.title.slice(0, 16)}:${b.status}:${b.pts}p+${b.card}:${b.when || ''}`).join(' || ')); return s };
  await h.nav(3); await ask('Ways to earn more'); await p.locator('.gr-answer').last().getByRole('button', { name: 'Join' }).last().click(); await p.waitForTimeout(300); await p.locator('.gr-answer').last().getByRole('button', { name: 'Join' }).first().click().catch(() => {}); await p.waitForTimeout(300);
  await sum('joined');
  await ask('flights to Lisbon on 10 Oct back 11 Oct for two'); console.log((await last()).slice(0, 200));
  await p.locator('.gr-flight').first().click(); await p.waitForTimeout(400); await btn(/Continue with/);
  await p.locator('.gr-answer').last().locator('input.app-in').nth(1).fill('Sam Taylor');
  // choose extra legroom seat for Amit on outbound
  await p.locator('.gr-answer').last().locator('.gr-seat:not([disabled])').first().click().catch(e => console.log('seat click fail', e.message.slice(0, 80)));
  await shot('seats');
  await btn('Continue', { exact: true }); await btn(/^Card/, { role: 'radio' }); await shot('checkout', true); console.log('CHECKOUT:', (await last()).slice(0, 600));
  await btn(/^Pay /); console.log('SHEET:', await sheetText()); await btn(/Face ID/, { w: 2000 }); await p.waitForTimeout(2500);
  let s = await sum('booked'); console.log('ledger', JSON.stringify(s.ledger.slice(0, 5).map(l => l.label + ' ' + l.pts)));
  // change return
  await ask('change my return flight'); await shot('chg-ret'); console.log('CR:', (await last()).slice(0, 400));
  await p.locator('.gr-answer').last().getByRole('button', { name: /Flight back/ }).click().catch(() => {}); await p.waitForTimeout(300); await shot('chg-ret2'); console.log('CR2:', (await last()).slice(0, 500));
  // Pick later date slot
  await p.locator('.gr-answer').last().locator('.gr-slot').nth(2).click(); await p.waitForTimeout(300); console.log('CR3:', (await last()).slice(0, 600)); await shot('chg-ret3');
  await p.locator('.gr-answer').last().locator('.gr-btn').last().click(); await p.waitForTimeout(500); console.log('CR4:', (await last()).slice(0, 400)); 
  if (await p.getByRole('button', { name: /^Pay / }).count()) { await btn(/^Pay /); await btn(/Face ID/, { w: 2000 }); await p.waitForTimeout(2500); console.log('CR5:', (await last()).slice(0, 400)) }
  s = await sum('after ret change');
  // disruption
  await h.nav(5); await btn('Cancel my next flight'); await h.nav(3); await shot('disr'); console.log('DISR:', (await last()).slice(0, 500));
  await btn('Next flight', { exact: true }); console.log('REBOOK:', (await last()).slice(0, 400)); s = await sum('rebooked');
  // cancel
  await ask('cancel my flight'); console.log('CX:', (await last()).slice(0, 500)); await shot('cx-ask');
  await btn('Yes, cancel'); console.log('CXD:', (await last()).slice(0, 600)); s = await sum('cancelled'); console.log('ledger', JSON.stringify(s.ledger.slice(0, 6).map(l => l.label + ' ' + l.pts))); await shot('cx-done');
  await ask('cancel my flight'); console.log('CX2:', (await last()).slice(0, 200));
  console.log('ERR', await h.done());
})();
