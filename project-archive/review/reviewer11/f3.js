const book = require('./book.js'), C = book.C
require('./lib.js')('UK', 'chg', async (h) => {
  const { p } = h
  await book(h)
  const s1 = await h.st(); console.log('after book pts', s1.balance, 'card', s1.card.balance)
  await h.ask('change my flight to 18 October'); await h.btn(/^Continue, /); console.log('A', await h.text()); console.log('SHEET', await h.sheet())
  if (await h.sheet()) await h.faceid(); console.log('DONE1', await h.text())
  let s = await h.st(); console.log('pts', s.balance, 'card', s.card.balance, 'bk', JSON.stringify({ total: s.bookings[0].total, card: s.bookings[0].card, date: s.bookings[0].extra.date, dep: s.bookings[0].extra.dep, earned: s.bookings[0].earned }))
  await h.ask('move my flight to the evening'); await h.tail('evening'); console.log('EVE', await h.text()); console.log('B', await h.buttons())
  const b = (await h.buttons()).find(x => /^Continue/.test(x)); if (b) { await h.btn(b, { exact: true }); if (await h.sheet()) { console.log('SHEET2', await h.sheet()); await h.faceid() } console.log('DONE2', await h.text()) }
  s = await h.st(); console.log('pts', s.balance, 'card', s.card.balance, 'bk', JSON.stringify({ total: s.bookings[0].total, card: s.bookings[0].card, date: s.bookings[0].extra.date, dep: s.bookings[0].extra.dep, back: s.bookings[0].extra.back }))
  await h.ask('change my return flight to 25 October'); await h.tail('ret25'); console.log('RET', await h.text()); console.log('B', await h.buttons())
  const b3 = (await h.buttons()).find(x => /^Continue/.test(x)); if (b3) { await h.btn(b3, { exact: true }); if (await h.sheet()) { console.log('SHEET3', await h.sheet()); await h.faceid() } console.log('DONE3', await h.text()) }
  await h.ask('change the return to the morning'); console.log('RETM', await h.text())
  await h.ask('change my flight to 30 October'); console.log('AFTERRET', await h.text())
  await h.ask('move my flight to yesterday'); console.log('YEST', await h.text())
  s = await h.st(); console.log('pts', s.balance, 'card', s.card.balance, 'txns', JSON.stringify(s.txns.slice(0,4).map(t=>[t.merchant,t.amount,t.refund||false,t.points])), 'ledger', JSON.stringify(s.ledger.slice(0,5).map(l=>[l.label,l.pts])))
  await h.nav(4); await h.full('wallet'); console.log('WALLET', (await h.page()).slice(0,600))
})
