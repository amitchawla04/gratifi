const book = require('./book.js'), C = book.C
const S = async (h, tag) => { const s = await h.st(); const b = s.bookings[0]; console.log(tag, 'pts', s.balance, 'card', s.card.balance, JSON.stringify({ st: b.status, total: b.total, pts: b.pts, card: b.card, earned: b.earned, date: b.extra.date, dep: b.extra.dep, back: b.extra.back && (b.extra.back.date + ' ' + b.extra.back.dep), seats: b.extra.seats, bseats: b.extra.backSeats })) }
require('./lib.js')('UK', 'chg2', async (h) => {
  const { p } = h
  await book(h)
  await S(h, 'BOOKED')
  await h.ask('change my flight to 30 October'); await h.btn(/^Change at no cost|^Continue/); console.log('X', (await h.text()).slice(0, 400)); console.log('B', await h.buttons()); console.log('SHEET', await h.sheet())
  if (await h.sheet()) await h.faceid()
  const bb = (await h.buttons()).find(x => /^(Pay|Confirm|Change)/.test(x)); if (bb) { await h.btn(bb, { exact: true }); if (await h.sheet()) { console.log('SH', await h.sheet()); await h.faceid() } }
  console.log('AFTER', (await h.text()).slice(0, 500)); await S(h, 'AFTER30')
  await h.tail('after30')
  await h.nav(4); await h.full('wallet30'); console.log('WALLET', (await h.page()).slice(0, 400))
})
