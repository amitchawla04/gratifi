const book = require('./book.js'), C = book.C
const S = async (h, tag) => { const s = await h.st(); const b = s.bookings[0]; console.log(tag, 'pts', s.balance, 'card', s.card.balance, JSON.stringify({ st: b.status, total: b.total, pts: b.pts, card: b.card, earned: b.earned, date: b.extra.date, dep: b.extra.dep, num: b.extra.number, back: b.extra.back && (b.extra.back.date + ' ' + b.extra.back.dep + ' ' + b.extra.back.number), seats: b.extra.seats, bseats: b.extra.backSeats, policy: b.policy })); console.log('   ledger', JSON.stringify(s.ledger.slice(0, 4).map(l => [l.label, l.pts])), 'txn', JSON.stringify(s.txns.slice(0, 3).map(t => [t.merchant, t.amount, !!t.refund]))) }
require('./lib.js')('UK', 'chg3', async (h) => {
  const { p } = h
  await book(h)
  await S(h, 'BOOKED')
  await h.ask('change my flight to 18 October'); await h.btn(/^Continue, /); await C(h.last().locator('[role=radio]').last()); await p.waitForTimeout(200); await h.btn(/^Pay /); console.log('SHEET', await h.sheet()); await h.faceid(); await h.tail('paid18'); console.log('DONE', (await h.text()).slice(0, 500))
  await S(h, 'CHANGED18')
  // return leg via wallet button
  await h.nav(4); await h.btn('Change date'); await h.tail('chg-date-ui'); console.log('UI', (await h.text()).slice(0, 300))
  await C(h.last().getByText('Flight back', { exact: true }).first()); await p.waitForTimeout(300); console.log('BACKTAB', (await h.text()).slice(0, 700))
  await h.tail('backtab')
})
