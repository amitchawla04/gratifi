const book = require('./book.js'), C = book.C
const S = async (h, tag) => { const s = await h.st(); const b = s.bookings[0]; console.log(tag, 'pts', s.balance, 'card', s.card.balance, JSON.stringify({ st: b.status, total: b.total, pts: b.pts, card: b.card, earned: b.earned, refunded: b.refunded, date: b.extra.date, dep: b.extra.dep, back: b.extra.back && (b.extra.back.date + ' ' + b.extra.back.dep), seats: b.extra.seats, bseats: b.extra.backSeats })); console.log('   ledger', JSON.stringify(s.ledger.slice(0, 4).map(l => [l.label, l.pts])), 'txn', JSON.stringify(s.txns.slice(0, 3).map(t => [t.merchant, t.amount, !!t.refund]))) }
require('./lib.js')('UK', 'cx', async (h) => {
  const { p } = h
  await book(h, undefined, 'mix')
  await S(h, 'BOOKED')
  await h.ask('change my seat'); await h.tail('seatchg'); console.log('SEAT', (await h.text()).slice(0, 300)); console.log('B', await h.buttons())
  await C(h.last().locator('[aria-label^="Seat 13D"]')); await p.waitForTimeout(200); console.log('after pick', (await h.text()).slice(-200))
  const sb = (await h.buttons()).find(x => /Save|Pay|Confirm/.test(x)); if (sb) { await h.btn(sb, { exact: true }); if (await h.sheet()) { console.log('SH', await h.sheet()); await h.faceid() } }
  console.log('SEATDONE', (await h.text()).slice(0, 300)); await S(h, 'SEATS')
  await h.ask('cancel my flight'); await h.tail('cxask'); console.log('CXASK', await h.text()); console.log('B', await h.buttons())
  await h.btn('Yes, cancel'); if (await h.sheet()) { console.log('SH', await h.sheet()); await h.faceid() } await h.tail('cxdone'); console.log('CXDONE', await h.text())
  await S(h, 'CANCELLED')
  const again = await p.getByRole('button', { name: 'Yes, cancel' }).count(); console.log('live yes-cancel buttons', again)
  if (again) { await p.getByRole('button', { name: 'Yes, cancel' }).first().evaluate(e => e.click()); await p.waitForTimeout(400); console.log('OLDBTN', await h.text()); await S(h, 'OLD') }
  await h.ask('cancel my flight'); console.log('CX2', await h.text())
  await p.reload(); await p.waitForTimeout(600); await h.nav(3); console.log('reload live yes', await p.getByRole('button', { name: 'Yes, cancel' }).count(), 'enabled', await p.getByRole('button', { name: 'Yes, cancel' }).evaluateAll(es => es.map(e => !e.disabled)))
  await h.nav(4); await C(p.getByText('Past', { exact: true }).first()); await p.waitForTimeout(300); await h.full('past'); console.log('PAST', (await h.page()).slice(0, 500))
})
