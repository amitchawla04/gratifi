const C = require('./book.js').C
const S = async (h, tag) => { const s = await h.st(); const b = s.bookings[0]; console.log(tag, 'pts', s.balance, 'card', s.card.balance, b && JSON.stringify({ st: b.status, total: b.total, pts: b.pts, card: b.card, refunded: b.refunded, policy: b.policy, when: b.when })) }
require('./lib.js')('UK', 'stay1', async (h) => {
  const { p } = h
  for (const day of ['Thu 1 Oct', 'Wed 30 Sep', 'Sat 3 Oct']) {
    await h.nav(3); await h.ask('A hotel in Lisbon'); await C(h.last().locator('.gr-itemrow').first()); await p.waitForTimeout(300)
    await C(h.last().getByText(day, { exact: true }).first()); await p.waitForTimeout(200)
    console.log(day, 'DETAIL', (await h.text()).match(/(Free cancellation[^£]*|Non-refundable[^£]*|No refund[^£]*|cancel[^£]{0,80})/i)?.[0])
    await h.btn('Continue', { exact: true }); console.log(day, 'CHECKOUT', (await h.text()).slice(0, 400))
    await C(h.last().locator('[role=radio]').last()); await h.btn(/^Pay /); await h.faceid(); await S(h, day + ' BOOKED')
    await h.ask('cancel my hotel'); console.log(day, 'CXASK', await h.text()); await h.btn('Yes, cancel').catch(() => console.log('no yes')); if (await h.sheet()) await h.faceid(); await S(h, day + ' CX')
  }
})
