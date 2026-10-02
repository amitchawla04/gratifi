require('./h.js')('UK', async (h) => {
  const { p, ask, click, full, confirm, nav, st, log, ans, shot, sheet } = h
  await nav(3)
  await ask('Noise-cancelling headphones'); await ans().locator('.gr-itemrow').first().click(); await p.waitForTimeout(300)
  await ans().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(400)
  const co = ans()
  await p.getByRole('button', { name: /^Pay / }).last().click(); await p.waitForTimeout(400)
  // double click confirm
  const btn = p.locator('.app-sheet .gr-btn').last(); await btn.dblclick(); await p.waitForTimeout(1500)
  let s = await st(); log('bookings', s.bookings.length, 'pts', s.balance)
  // old pay button
  const oldPay = p.locator('.gr-answer').nth(2).getByRole('button', { name: /^Pay / })
  log('old pay count', await oldPay.count(), await oldPay.count() ? await oldPay.first().isDisabled() : '')
  if (await oldPay.count() && !(await oldPay.first().isDisabled())) { await oldPay.first().click(); await p.waitForTimeout(500); log('SHEET after old pay: ' + await sheet()) }
  // reload during a sheet
  await ask('Transfer 5000 points to Northway Miles'); log(await h.lastText())
  await p.reload(); await p.waitForTimeout(800); await nav(3)
  log('after reload sheet: ' + await sheet())
  await full('old-reload')
  // old buttons after reload
  const allBtns = await p.locator('.gr-answer button:not([disabled])').allInnerTexts(); log('enabled buttons after reload: ' + allBtns.join(' / ').slice(0, 800))
  s = await st(); log('bookings', s.bookings.length, 'pts', s.balance)
}, { name: 'old', len: 300 })
