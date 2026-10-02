(async () => {
  const H = await require('./h.js')('UK', 'light', 'uk-fl')
  const { p, full, nav, ask, click, last, st, lastMsg, sheetText, confirm, waitSheetGone, done } = H
  await nav(3)
  await ask('Flights to Lisbon on 20 October for 3 people, back on the 25th'); console.log(await lastMsg()); await full('results')
  await p.locator('.gr-flight').nth(1).click(); await p.waitForTimeout(500); await full('fares')
  // pick flex
  await p.getByText('Flex', { exact: true }).last().click().catch(e => console.log('flex click fail')); await p.waitForTimeout(300)
  // choose second return option
  const slots = last().locator('.gr-slot'); console.log('return slots', await slots.count()); if (await slots.count() > 1) await slots.nth(1).click()
  await full('fares2')
  await click(/Continue with/); await full('seats')
  const ins = last().locator('.app-in:not([disabled])'); console.log('name inputs', await ins.count())
  await ins.nth(0).fill('Sam Taylor'); await ins.nth(1).fill('Jo Taylor')
  // add a bag via stepper plus
  await full('seats-filled')
  await click('Continue', { exact: true }); await full('checkout')
  const s0 = await st(); const d = Object.values(s0.drafts)[0]; console.log('draft', JSON.stringify({ total: d.total, unit: d.unit, qty: d.qty, detail: d.detail }))
  const pay = p.getByRole('button', { name: /^Pay / }).last(); console.log('paybtn', await pay.innerText())
  await pay.click(); await p.waitForTimeout(400); console.log('SHEET', await sheetText())
  await confirm(undefined, 'sheet'); await p.waitForTimeout(800); await H.shot('sheet-done'); await waitSheetGone(); await full('receipt')
  const s1 = await st(); const b = s1.bookings[0]; console.log('booking', JSON.stringify({ total: b.total, pts: b.pts, card: b.card, earned: b.earned, extra: b.extra }))
  console.log('balance', s0.balance, '->', s1.balance, 'card', s0.card.balance, '->', s1.card.balance); console.log('ledger', JSON.stringify(s1.ledger.slice(0, 3)))
  await nav(4); await full('wallet'); await click('Show pass'); await full('pass')
  console.log(await done())
})()
