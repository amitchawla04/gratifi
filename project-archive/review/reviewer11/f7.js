const book = require('./book.js'), C = book.C
const S = async (h, tag) => { const s = await h.st(); const b = s.bookings[0]; console.log(tag, 'pts', s.balance, 'card', s.card.balance, JSON.stringify({ st: b.status, total: b.total, pts: b.pts, card: b.card, refunded: b.refunded, date: b.extra.date, dep: b.extra.dep, num: b.extra.number, back: b.extra.back && (b.extra.back.date + ' ' + b.extra.back.dep), tracker: b.tracker })) }
require('./lib.js')('UK', 'dis', async (h) => {
  const { p } = h
  await book(h, 'Flights to Lisbon 21st October to 23rd October for 2', 'card', 'Flex')
  await S(h, 'BOOKED')
  await h.nav(5); await h.btn('Cancel my next flight'); await h.tail('dis'); console.log('DIS', await h.text()); console.log('B', await h.buttons())
  await h.btn('Move to this flight', { exact: true }).catch(e => console.log('no move btn')); if (await h.sheet()) { console.log('SH', await h.sheet()); await h.faceid() }
  await h.tail('rebooked'); console.log('REB', await h.text()); await S(h, 'REBOOKED')
  await h.ask('check compensation'); console.log('COMP', await h.text())
  await h.ask('cancel my flight'); console.log('CXASK', await h.text())
  await h.btn('Yes, cancel'); if (await h.sheet()) await h.faceid(); console.log('CXD', await h.text()); await S(h, 'CX')
})
