const setup = require('./h.js'); const L = require('./lib.js')
module.exports = async () => { const h = await setup('UK', { tag: 'mm2' }); const { p, shot, nav, ask, btn, confirm, st, lastText, last } = h
  await nav(3)
  await L.bookFlight(h, 'Flights to Paris 20 Oct back 23 Oct for 2', ['Priya Chawla'], 'Points and card')
  console.log(JSON.stringify(await L.summ(h)))
  await nav(5); await btn('Cancel my next flight'); await nav(3)
  for (const q of ['change the date of my paris flight', 'cancel my flight', 'change my seat', 'show my boarding pass', 'I want a refund for my flight']) { await ask(q); console.log('>> ' + q + '\n   ' + (await lastText()).slice(0, 400)) }
  await shot('refund-ask')
  await btn(/Full refund/); console.log('R1', await lastText()); await shot('r1')
  const y = p.getByRole('button', { name: /^Yes/ }); if (await y.count()) { await y.last().click(); await p.waitForTimeout(500) }
  console.log('DONE', await lastText()); await shot('refunded')
  console.log(JSON.stringify(await L.summ(h)))
  await ask('rebook my paris flight'); console.log('REB', await lastText())
  await h.close() }
