const book = require('./book.js'), C = book.C
require('./lib.js')('UK', 'seatchg', async (h) => {
  const { p } = h
  await book(h, 'Flights to Lisbon 16th October to 23rd October 1 adult 1 child')
  await h.ask('change my seat'); const chips = h.last().locator('.gr-chip'); console.log(await chips.allInnerTexts())
  await C(chips.nth(1)); await p.waitForTimeout(200)
  console.log('child exit', await h.last().evaluate(e => [...e.querySelectorAll('.gr-seat')].filter(x => /^Seat 14/.test(x.getAttribute('aria-label'))).map(x => x.getAttribute('aria-label') + (x.disabled ? '(dis)' : '')).join(',')))
  await C(h.last().getByText('Flight back', { exact: true }).first()); await p.waitForTimeout(200); await C(h.last().locator('.gr-chip').nth(1)); await p.waitForTimeout(200)
  console.log('child exit back', await h.last().evaluate(e => [...e.querySelectorAll('.gr-seat')].filter(x => /^Seat 14/.test(x.getAttribute('aria-label'))).map(x => x.getAttribute('aria-label') + (x.disabled ? '(dis)' : '')).join(',')))
  await C(h.last().locator('.gr-chip').nth(0)); await C(h.last().locator('[aria-label^="Seat 14A"],[aria-label^="Seat 14B"],[aria-label^="Seat 14D"]').first()); await p.waitForTimeout(200)
  console.log('adult extra on back', (await h.text()).slice(-200))
  await h.btn(/Save seats|Pay|Continue/); if (await h.sheet()) { console.log('SH', await h.sheet()); await h.faceid() } console.log('DONE', (await h.text()).slice(0, 250))
  const s = await h.st(); console.log(s.card.balance, s.bookings[0].extra.seats, s.bookings[0].extra.backSeats, s.bookings[0].total)
})
