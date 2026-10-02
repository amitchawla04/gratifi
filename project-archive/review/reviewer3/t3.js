(async () => {
  const H = await require('./h.js')('UK', 'light', 'uk-chg')
  const { p, full, nav, ask, click, last, st, lastMsg, sheetText, confirm, waitSheetGone, done } = H
  await nav(3)
  await ask('One way to Paris on 14 October just me'); console.log(await lastMsg())
  await p.locator('.gr-flight').first().click(); await p.waitForTimeout(500)
  await click(/Continue with/); await click('Continue', { exact: true })
  // pay by card
  await last().getByText('Card', { exact: true }).click().catch(() => console.log('no card opt')); await p.waitForTimeout(300)
  const pay = p.getByRole('button', { name: /^Pay / }).last(); console.log('paybtn', await pay.innerText()); await pay.click(); await confirm(); await waitSheetGone()
  let s = await st(); let b = s.bookings[0]; console.log('booked', b.total, b.pts, b.card, 'earned', b.earned, 'bal', s.balance, 'card', s.card.balance, b.when)
  const bal0 = 48210, card0 = 906.98
  // find a cheaper date via changeQuote in page? try each day in change UI
  await ask('change my flight'); await full('change')
  const chips = last().locator('.gr-slot'); const n = await chips.count(); let pick = -1
  for (let i = 0; i < n; i++) { await chips.nth(i).click(); await p.waitForTimeout(150); const t = await last().innerText(); if (/Back to you as points/.test(t)) { pick = i; console.log('credit day', i, (t.match(/Back to you as points\s*([\d,]+ pts)/) || [])[1]); break } }
  if (pick < 0) { console.log('no credit day'); }
  await full('change-picked')
  await last().locator('.gr-btn').last().click(); await p.waitForTimeout(600); console.log(await lastMsg()); await full('changed')
  s = await st(); b = s.bookings[0]; console.log('after change', b.total, b.pts, b.card, 'bal', s.balance, 'card', s.card.balance, b.when)
  await ask('cancel my flight'); console.log(await lastMsg()); await full('cancel-ask')
  await click('Yes, cancel'); console.log(await lastMsg()); await full('cancelled')
  s = await st(); console.log('after cancel bal', s.balance, 'card', s.card.balance, 'net pts', s.balance - bal0, 'net card', (s.card.balance - card0).toFixed(2))
  console.log('ledger', s.ledger.slice(0, 6).map(l => l.label + ' ' + l.pts).join(' | '))
  await ask('cancel my flight'); console.log('2nd', await lastMsg())
  console.log(await done())
})()
