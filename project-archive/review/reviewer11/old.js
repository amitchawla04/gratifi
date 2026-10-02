const book = require('./book.js'), C = book.C
require('./lib.js')('UK', 'old', async (h) => {
  const { p } = h
  // two checkouts open, pay second, then try first
  await h.nav(3); await h.ask('Noise-cancelling headphones'); await C(h.last().locator('.gr-itemrow').first()); await p.waitForTimeout(300); await h.btn('Continue', { exact: true })
  await h.ask('Noise-cancelling headphones'); await C(h.last().locator('.gr-itemrow').first()); await p.waitForTimeout(300); await h.btn('Continue', { exact: true })
  const pays = p.getByRole('button', { name: /^Pay / }); console.log('pay buttons', await pays.count(), await pays.evaluateAll(es => es.map(e => !e.disabled)))
  await pays.last().evaluate(e => e.click()); await p.waitForTimeout(300); await h.faceid()
  const pays2 = p.getByRole('button', { name: /^Pay / }); console.log('after pay: pay buttons', await pays2.count(), await pays2.evaluateAll(es => es.map(e => !e.disabled)))
  if (await pays2.count()) { await pays2.first().evaluate(e => e.click()); await p.waitForTimeout(400); console.log('OLD PAY sheet', await h.sheet()); if (await h.sheet()) { await h.faceid(); const s = await h.st(); console.log('bookings', s.bookings.length, 'bal', s.balance) } }
  // old detail card continue
  const conts = p.getByRole('button', { name: 'Continue', exact: true }); console.log('continue btns enabled', await conts.evaluateAll(es => es.map(e => !e.disabled)))
  await p.reload(); await p.waitForTimeout(700); await h.nav(3)
  console.log('after reload pay', await p.getByRole('button', { name: /^Pay / }).evaluateAll(es => es.map(e => !e.disabled)), 'cont', await p.getByRole('button', { name: 'Continue', exact: true }).evaluateAll(es => es.map(e => !e.disabled)))
  // old item rows clickable?
  await C(p.locator('.gr-itemrow').first()); await p.waitForTimeout(300); console.log('OLD ROW', (await h.text()).slice(0, 150))
})
