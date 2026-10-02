(async () => {
  const H = await require('./h.js')('IN', 'light', 'in')
  const { p, full, nav, ask, click, last, st, lastMsg, sheetText, confirm, waitSheetGone, done, shot } = H
  const L = require('./lib.js')(H)
  await full('home'); await nav(3); await ask('hello')
  await ask('Flights to Goa next weekend for two'); await L.log('fl'); await full('fl')
  await p.locator('.gr-flight').first().click(); await p.waitForTimeout(500); await full('fares')
  await click(/Continue with/); await last().locator('.app-in:not([disabled])').first().fill('Priya Rao'); await click('Continue', { exact: true }); await full('checkout')
  await last().getByText('Card', { exact: true }).click(); await p.waitForTimeout(200)
  const pay = p.getByRole('button', { name: /^Pay / }).last(); console.log(await pay.innerText()); await pay.click(); await p.waitForTimeout(400)
  console.log('SHEET', await sheetText()); await shot('otp-sheet')
  // wrong code three times
  for (let k = 0; k < 3; k++) { const ok = await confirm('111111'); await p.waitForTimeout(600); console.log('wrong', k, await sheetText()); await shot('wrong' + k) }
  let s = await st(); console.log('bookings after wrong', s.bookings.length, 'card', s.card.balance)
  // close and retry with right code
  await p.locator('.app-sheet [aria-label=Close], .app-sheet .app-sheet-x, .app-sheet button[aria-label*="lose"]').first().click().catch(e => console.log('no close', e.message.slice(0, 50)))
  await p.waitForTimeout(400); console.log('sheet after close', await sheetText())
  await pay.click().catch(() => {}); await p.waitForTimeout(400); console.log('SHEET2', await sheetText())
  await confirm('482193'); await p.waitForTimeout(700); await shot('ok'); await waitSheetGone(); await L.log('paid'); await full('receipt')
  s = await st(); const b = s.bookings[0]; console.log('booking', b ? [b.total, b.pts, b.card, b.earned] : 'none', 'card', s.card.balance)
  // cash+points grocery and ride etc
  await ask('Milk, eggs and bread'); await full('groc'); await click('Checkout'); console.log(await L.payIt()); 
  await ask('A table tonight for two'); await L.pickFirst(); await full('dine')
  await ask('Book a lounge'); await full('lounge')
  await ask('A ride now'); await L.pickFirst(); await p.locator('.gr-detail .gr-slot').last().click(); await full('ride')
  await ask('Things to do in Goa'); await full('exp')
  await ask('A gift card for a friend'); await full('gift')
  await ask('Which subscriptions are included?'); await full('subs')
  await ask('Travel insurance'); await full('ins')
  await ask('What do I owe?'); await click(/^Pay ₹/); console.log('BILL SHEET', await sheetText()); await confirm(); await waitSheetGone(); await L.log('bill')
  await nav(5); await full('me'); await nav(4); await full('wallet')
  console.log(await done())
})()
