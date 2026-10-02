(async () => {
  const H = await require('./h.js')('UK', 'light', 'uk-d')
  const { p, full, nav, ask, click, last, st, lastMsg, sheetText, confirm, waitSheetGone, done, shot } = H
  const L = require('./lib.js')(H)
  await nav(3); await ask('hello')
  const step = async (label, fn) => { const a = await L.snap(); try { await fn() } catch (e) { console.log('!! ' + label + ' ' + e.message.split('\n')[0]); await H.shot('fail-' + label) } const b = await L.snap(); console.log(`== ${label}: ${L.diff(a, b)}`) }
  const sim = async (i, on = true) => { await nav(5); const sw = p.locator('.app-demo [role=switch]').nth(i); const cur = await sw.getAttribute('aria-checked'); if ((cur === 'true') !== on) await sw.click(); await p.waitForTimeout(200); await nav(3) }
  await step('owe-min', async () => { await ask('What do I owe?'); await last().getByRole('radio').nth(2).click(); await p.waitForTimeout(200); await full('owe-min'); await click(/^Pay £/); console.log('  SHEET', await sheetText()); await confirm(); await waitSheetGone(); await L.log('paid'); const s = await st(); console.log('  card', s.card.balance, s.card.due, s.card.min) })
  await step('xfer', async () => { await ask('Transfer points to miles'); await last().locator('.gr-ack input').first().check(); await last().locator('.gr-btn').first().click(); await p.waitForTimeout(400); console.log('  SHEET', await sheetText()); await confirm(); await waitSheetGone(); await L.log('xfer-done'); await full('xfer-done') })
  await step('xfer-undo', async () => { await ask('cancel my points transfer'); await L.log('xundo') })
  // supplier down
  await sim(1, true)
  await step('down-flight', async () => { await ask('Flights to Paris next weekend'); await L.log('down-fl'); await full('down-fl') })
  await step('down-shop', async () => { await ask('Leather trainers'); await L.pickFirst(); await L.cta(); console.log('  ', await L.payIt()); await L.log('down-pay'); await full('down-pay') })
  await step('down-free', async () => { await ask('A table tonight for two'); await L.pickFirst(); await L.cta(); console.log('  ', await L.payIt()); await L.log('down-dine') })
  await step('down-xfer', async () => { await ask('Donate points to charity'); await last().locator('.gr-btn').first().click(); await p.waitForTimeout(300); await confirm(); await waitSheetGone(); await L.log('down-donate') })
  await step('down-concierge', async () => { await ask('Find a special gift'); await click('Send to the concierge'); await L.log('down-conc') })
  await sim(1, false)
  // decline
  await sim(2, true)
  await step('decline', async () => { await ask('Leather trainers'); await L.pickFirst(); await L.cta(); console.log('  ', await L.payIt('Card')); await L.log('decl'); await full('decl') })
  await step('decline-pts', async () => { await click('Pay with points instead'); await full('decl-pts'); console.log('  ', await L.payIt()); await L.log('decl-pts-done') })
  await sim(2, false)
  // price rise
  await sim(0, true)
  await step('rise', async () => { await ask('A cabin suitcase'); await L.pickFirst(); await L.cta(); const pay = p.getByRole('button', { name: /^Pay / }).last(); await pay.click(); await p.waitForTimeout(400); console.log('  sheet open?', !!(await p.$('.app-sheet'))); await L.log('rise'); await full('rise') })
  await step('rise-continue', async () => { await click(/^Continue at/); await full('rise-reopen'); const s = await st(); const d = Object.values(s.drafts)[0]; console.log('  draft', d.total, JSON.stringify(d.detail)); console.log('  ', await L.payIt()); await L.log('rise-done'); const s2 = await st(); console.log('  booking total', s2.bookings[0].total, s2.bookings[0].pts, s2.bookings[0].card) })
  // delay order
  await step('groc', async () => { await ask('Nappies now'); await click('Checkout'); console.log('  ', await L.payIt('Card')) })
  await step('late', async () => { await nav(5); await click('Delay my order'); await L.log('late'); await full('late'); await click('Cancel for a full refund'); await L.log('late-refund') })
  await step('late2', async () => { await nav(5); await click('Delay my order'); await L.log('late2') })
  await step('fraud', async () => { await nav(5); await click('Suspicious payment'); await L.log('fraud'); await full('fraud'); await click("It wasn't me"); await L.log('fraud2'); await full('fraud2') })
  await step('cardpay', async () => { await nav(5); await click('A card payment'); await L.log('cardpay') })
  await step('ptsin', async () => { await nav(5); await click(/Points come in/); const s = await st(); console.log('  ledger', s.ledger[0].label, s.ledger[0].pts) })
  await step('invest-sell', async () => { await nav(3); await ask('Put points into gold'); await last().locator('.gr-ack input').check(); await click('Continue with the partner'); await confirm(); await waitSheetGone(); await nav(4); await click('Requests').catch(() => {}); await full('requests'); await click('Sell'); await L.log('sell'); await click('Yes, sell'); await L.log('sold') })
  await step('reset', async () => { await nav(5); await click('Reset demo'); await click('Yes, reset'); const s = await st(); console.log('  after reset', s.balance, s.bookings.length, s.chat.length, JSON.stringify(s.sim)) })
  console.log(await done())
})()
