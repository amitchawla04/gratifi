const book = require('./book.js'), C = book.C
const snap = async (h) => { const s = await h.st(); return s && JSON.stringify({ b: s.balance, c: s.card.balance, bk: s.bookings.length, l: s.ledger.length, t: s.txns.length, exp: s.expiring, pend: (s.pending||[]).length }) }
require('./lib.js')('UK', 'demo', async (h) => {
  const { p } = h
  await h.nav(5); const sw = p.locator('.app-demo [role=switch]'); console.log('switches', await sw.count(), await p.locator('.app-demo').innerText().then(t => t.replace(/\s+/g, ' ')))
  await C(sw.nth(1)); await p.waitForTimeout(200); const s0 = await snap(h); console.log('S0', s0)
  await h.nav(3); await h.ask('Noise-cancelling headphones'); await C(h.last().locator('.gr-itemrow').first()); await p.waitForTimeout(300); await h.btn('Continue', { exact: true }); await h.btn(/^Pay /); console.log('SHEET', await h.sheet()); if (await h.sheet()) await h.faceid()
  console.log('SUPPLIER', await h.text()); console.log('S1', await snap(h), 'same?', (await snap(h)) === s0); await h.tail('supplier')
  // supplier down: concierge, transfer, flight
  await h.ask('Transfer points to miles'); console.log('T', (await h.text()).slice(0, 200))
  await book(h, 'Flights to Lisbon 16th October to 23rd October for 2', 'points').catch(e => console.log('flight fail', e.message.slice(0, 80))); console.log('FLIGHT', (await h.text()).slice(0, 300)); console.log('S2', await snap(h))
  await h.nav(5); await C(p.locator('.app-demo [role=switch]').nth(1)); 
  for (const b of ['Points come in (+5,000)', 'A card payment', 'Suspicious payment', 'Return window ends', 'Deliver my order', 'Delay my order', 'Cancel my next flight']) {
    await h.nav(5); const before = await snap(h); await h.btn(b).catch(e => console.log('nobtn', b)); await p.waitForTimeout(400); const after = await snap(h)
    const txt = await p.evaluate(() => { const a = [...document.querySelectorAll('.gr-answer')].pop(); return a ? a.innerText.replace(/\s+/g, ' ').slice(0, 250) : '' })
    const tab = await p.evaluate(() => document.querySelector('.app').dataset.tab)
    console.log(`DEMO ${b}: tab=${tab} ${before} -> ${after} | ${txt}`)
  }
  await h.nav(5); await h.btn('Reset demo'); await p.waitForTimeout(300); console.log('RESET', await h.sheet(), await snap(h))
})
