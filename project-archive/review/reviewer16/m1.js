const setup = require('./h.js'); const L = require('./lib.js')
module.exports = async () => { const h = await setup('UK', { tag: 'mm1' }); const { p, shot, nav, ask, btn, confirm, st, lastText, last } = h
  await nav(3)
  // flight card-only (earns points)
  console.log(await L.bookFlight(h, 'Flights to Paris 20 Oct back 23 Oct for 2', ['Priya Chawla'], 'Card'))
  console.log(JSON.stringify(await L.summ(h)))
  // spend all points: donate full balance
  const s = await st(); await ask('donate ' + s.balance + ' points to Clean Seas'); console.log('D', await lastText()); await confirm(); console.log(JSON.stringify(await L.summ(h)))
  await nav(4); await btn('Cancel', { exact: true }); console.log('CANCEL ASK', await lastText()); await shot('cancel-ask')
  await btn('Yes, cancel'); console.log('CANCELLED', await lastText()); await shot('cancelled')
  console.log(JSON.stringify(await L.summ(h)))
  // cancel again via text
  await ask('cancel my Paris flight'); console.log('AGAIN', await lastText())
  await h.close() }
