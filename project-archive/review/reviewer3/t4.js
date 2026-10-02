(async () => {
  const H = await require('./h.js')('UK', 'light', 'uk-dis')
  const { p, full, nav, ask, click, last, st, lastMsg, sheetText, confirm, waitSheetGone, done } = H
  await nav(3)
  await ask('Flights to Barcelona next weekend for two'); console.log(await lastMsg())
  await p.locator('.gr-flight').first().click(); await p.waitForTimeout(500)
  await click(/Continue with/)
  await last().locator('.app-in:not([disabled])').first().fill('Sam Taylor')
  // pick a row-14 seat: click seat 14D
  const seatBtns = last().locator('button[aria-label*="14"]'); console.log('row14 seats', await seatBtns.count())
  if (await seatBtns.count()) { await seatBtns.nth(3).click(); await p.waitForTimeout(200) }
  await full('seats14')
  await click('Continue', { exact: true }); await full('checkout')
  let s = await st(); const d = Object.values(s.drafts)[0]; console.log('draft', d.total, JSON.stringify(d.detail.slice(-3)))
  const pay = p.getByRole('button', { name: /^Pay / }).last(); console.log(await pay.innerText()); await pay.click(); await confirm(); await waitSheetGone()
  s = await st(); let b = s.bookings[0]; console.log('booked', b.total, b.pts, b.card, b.earned, b.extra.seats)
  // change seats to row 14 via chat
  await ask('change my seat'); await full('seatchange')
  const sb = last().locator('button[aria-label*="14"]'); console.log('seatchange row14 btns', await sb.count(), await sb.first().getAttribute('aria-label').catch(() => ''))
  if (await sb.count()) await sb.nth(4).click()
  await click('Save seats'); console.log(await lastMsg()); s = await st(); console.log('after seat change total', s.bookings[0].total, s.bookings[0].extra.seats, JSON.stringify(s.bookings[0].detail.filter(x => /Seat/.test(x[0]))))
  // disruption
  await nav(5); await click('Cancel my next flight'); await full('disruption'); console.log(await lastMsg())
  await click('Next flight'); console.log(await lastMsg()); await full('rebooked')
  await nav(5); await click('Cancel my next flight'); console.log('again', await lastMsg())
  await nav(4); await click('Show pass'); await full('pass')
  // passes with names
  console.log(await done())
})()
