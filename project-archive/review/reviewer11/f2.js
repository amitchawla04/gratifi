const C = (l) => l.evaluate(e => e.click())
require('./lib.js')('UK', 'mng', async (h) => {
  const { p } = h
  await h.nav(5); await h.nav(3); const s0 = await h.st() || {balance:48210,card:{balance:906.98}}
  await h.nav(3); await h.ask('Flights to Lisbon 16th October to 23rd October 2 adults 1 child')
  await C(p.locator('.gr-flight').first()); await p.waitForTimeout(500)
  await h.btn(/Continue with/)
  const ins = h.last().locator('input')
  await ins.nth(1).fill('Priya Chawla'); await ins.nth(2).fill('Kabir Chawla'); await ins.nth(3).fill('2018-05-05'); await p.waitForTimeout(200)
  await h.btn(/^Continue$/); 
  const ck = await h.text(); console.log('CHECKOUT', ck.slice(-300))
  // choose card only
  const radios = h.last().locator('[role=radio]'); console.log('radios', await radios.allInnerTexts())
  await C(radios.last()); await p.waitForTimeout(200)
  await h.btn(/^Pay /); console.log('SHEET', await h.sheet()); await h.shot('sheet')
  await h.faceid(); await h.tail('receipt'); console.log('RECEIPT', await h.text())
  const s1 = await h.st(); console.log('BAL pts', s0.balance, '->', s1.balance, 'card', s0.card.balance, '->', s1.card.balance, 'ledger', JSON.stringify(s1.ledger.slice(0, 3)))
  const bk = s1.bookings[0]; console.log('BOOKING', JSON.stringify({ total: bk.total, pts: bk.pts, card: bk.card, earned: bk.earned, policy: bk.policy, status: bk.status, extra: bk.extra && Object.keys(bk.extra) }))
  await h.nav(4); await h.full('wallet')
  await h.btn(/Show pass|Boarding pass/); await h.full('pass'); console.log('PASS', await h.page())
  await h.nav(3); await h.ask('change my flight to 18 October'); await h.tail('chg18'); console.log('CHG18', await h.text()); console.log('B', await h.buttons())
})
