const C = require('./book.js').C
const snap = async (h) => { const s = await h.st(); return JSON.stringify({ b: s.balance, c: s.card.balance, bks: s.bookings.map(b => [b.title.slice(0, 18), b.status, b.refunded, b.tracker && b.tracker.steps[b.tracker.current]]) }) }
require('./lib.js')('UK', 'ret', async (h) => {
  const { p } = h
  for (const q of ['Noise-cancelling headphones', 'Rain shell jacket']) { await h.nav(3); await h.ask(q); await C(h.last().locator('.gr-itemrow').first()); await p.waitForTimeout(300); await h.btn('Continue', { exact: true }); await C(h.last().locator('[role=radio]').nth(1)); await h.btn(/^Pay /); await h.faceid() }
  console.log('BOUGHT', await snap(h))
  await h.ask('return my headphones'); console.log('RET-EARLY', await h.text())
  await h.nav(5); await h.btn('Deliver my order'); await h.nav(5); await h.btn('Deliver my order'); console.log('DELIV', await h.text())
  await h.ask('return my headphones'); console.log('RET', await h.text()); console.log('B', await h.buttons())
  const b = (await h.buttons()).find(x => /return|Yes|Start|Send|Book/i.test(x)); if (b) { await h.btn(b, { exact: true }); if (await h.sheet()) await h.faceid() }
  console.log('RET2', await h.text()); console.log('B', await h.buttons())
  const b2 = (await h.buttons()).find(x => /Confirm|Yes|Send|Book/i.test(x)); if (b2) { await h.btn(b2, { exact: true }); console.log('RET3', await h.text()) }
  await h.ask('my jacket arrived damaged'); console.log('CLAIM', await h.text()); console.log('B', await h.buttons())
  await C(h.last().locator('button').nth(1)).catch(()=>{}); await h.btn('Send claim').catch(e => console.log('no send')); console.log('CLAIM2', await h.text())
  console.log('T0', await snap(h))
  await p.waitForTimeout(15000); await p.reload(); await p.waitForTimeout(1000); console.log('T15 reload', await snap(h))
  await p.waitForTimeout(32000); console.log('T47', await snap(h))
  await h.nav(3); await h.tail('after'); console.log('CHAT', (await h.text()).slice(0, 400))
  const s = await h.st(); console.log('ledger', JSON.stringify(s.ledger.slice(0, 6).map(l => [l.label, l.pts])), 'txn', JSON.stringify(s.txns.slice(0, 4).map(t => [t.merchant, t.amount, !!t.refund])))
})
