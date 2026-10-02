const setup = require('./h.js')
;(async () => {
  const H = await setup(process.argv[2] || 'UK', { tag: 'fl-' + (process.argv[2] || 'UK'), q: '&tab=chat' })
  const { p, ask, btn, shot, tall, money, lastAnswer, confirmSheet, S, last, nav } = H
  const log = async (l) => { const s = await S(); console.log(l, JSON.stringify(await money()), 'lounge', s.loungeLeft, 'chl', s.challenges.map(c => c.id + ':' + c.joined + ':' + c.progress + ':' + !!c.done).join(' ')) }
  await ask('Ways to earn more'); await p.getByRole('button', { name: 'Join' }).first().click(); await p.waitForTimeout(300); await p.getByRole('button', { name: 'Join' }).first().click(); await p.waitForTimeout(300)
  await log('start')
  await ask('flights to Lisbon on 9 October back 10 October for two')
  console.log('search:', (await last()).text)
  await p.locator('.gr-flight').first().click(); await p.waitForTimeout(400)
  await tall('fares')
  // pick a different return flight option
  const backOpts = p.locator('.gr-answer').last().locator('button', { hasText: /more each|less each|Chosen/ })
  console.log('return options', await backOpts.count())
  await btn(/Continue with/)
  const ins = p.locator('.gr-answer').last().locator('input.app-in'); for (let i = 0; i < await ins.count(); i++) { if (!(await ins.nth(i).inputValue())) await ins.nth(i).fill('Sam Taylor') }
  // select traveller 2 then pick seat, flight back tab, pick seat for traveller 2
  await tall('seats')
  await btn('Continue', { exact: true })
  await p.getByRole('radio', { name: /^Card/ }).last().click(); await p.waitForTimeout(200)
  await tall('checkout')
  await btn(/^Pay /); await confirmSheet()
  await log('booked'); let s = await S(); console.log('ledger', s.ledger.slice(0, 4).map(l => l.label + ' ' + l.pts).join(' | '))
  await tall('receipt')
  // change return flight
  await ask('change my return flight'); console.log('chg:', (await last()).text); await tall('chg-return')

  await lastAnswer().locator('.gr-slot').nth(2).click(); await p.waitForTimeout(300); await shot('chg-day', true)
  console.log('change block text:', (await lastAnswer().innerText()).slice(-400))
  await lastAnswer().locator('.gr-btn').last().click(); await p.waitForTimeout(500); await shot('chg-result', true)
  console.log('chg result:', (await last()).text)
  const pay = p.getByRole('button', { name: /^Pay / }); if (await pay.count()) { await tall('chg-checkout'); await pay.last().click(); await confirmSheet(); console.log('after pay diff:', (await last()).text) }
  await log('after return change'); s = await S(); console.log('bk', JSON.stringify({ when: s.bookings[0].when, total: s.bookings[0].total, pts: s.bookings[0].pts, card: s.bookings[0].card, earned: s.bookings[0].earned, detail: s.bookings[0].detail }))
  console.log('ledger', s.ledger.slice(0, 4).map(l => l.label + ' ' + l.pts).join(' | '))
  // seats: return flight, traveller 2
  await ask('change seats'); await p.waitForTimeout(300)
  const sc = lastAnswer()
  await sc.getByRole('button', { name: /Flight back|flight back/ }).first().click().catch(e => console.log('no back tab', e.message.slice(0, 60)))
  await p.waitForTimeout(200)
  await sc.getByRole('button', { name: /Sam|Traveller 2/ }).first().click().catch(e => console.log('no trav2', e.message.slice(0, 60)))
  await p.waitForTimeout(200)
  const free = sc.locator('.gr-seat:not([disabled])'); console.log('free seats', await free.count())
  await free.nth(1).click(); await p.waitForTimeout(200); await tall('seat-pick')
  console.log('seat block tail:', (await sc.innerText()).slice(-300))
  await btn(/Save seats/); await p.waitForTimeout(300); console.log('seat save:', (await last()).text)
  const pay2 = p.getByRole('button', { name: /^Pay / }); if (await pay2.count() && await pay2.last().isEnabled()) { await pay2.last().click(); await confirmSheet(); console.log('after seat pay:', (await last()).text) }
  s = await S(); console.log('seats', JSON.stringify({ seats: s.bookings[0].extra.seats, back: s.bookings[0].extra.backSeats }))
  await nav(4); await btn(/Boarding pass|Show pass/); await tall('passes'); await nav(3)
  // cancel
  await ask('cancel my flight'); console.log('cancel ask:', (await last()).text); await tall('cancel-ask')
  await btn('Yes, cancel'); console.log('cancel:', (await last()).text)
  await log('after cancel'); s = await S(); console.log('ledger', s.ledger.slice(0, 6).map(l => l.label + ' ' + l.pts).join(' | ')); console.log('txn0', JSON.stringify(s.txns.slice(0,2)))
  await ask('cancel my flight'); console.log('cancel again:', (await last()).text)
  await nav(4); await tall('wallet-after'); 
  await H.done()
})()
