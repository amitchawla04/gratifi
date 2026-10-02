const H = require('./h.js')
const m = process.argv[2] || 'UK'
H.run(async (h) => {
  const { p, ask, click, full, shot, confirm, money, log, sheet, nav } = h
  const toggle = async (label) => { await nav(5); const row = p.locator('.app-demo').getByText(label).locator('xpath=ancestor::*[.//*[@role="switch"]][1]'); await row.locator('[role=switch]').first().click(); await p.waitForTimeout(200); await nav(3) }
  const openCheckout = async (q) => { await ask(q); await p.locator('.gr-answer').last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(300); const b = p.locator('.gr-answer').last().locator('.gr-detail .gr-btn').last(); if (/size/i.test(await b.innerText())) { await p.locator('.gr-answer').last().locator('.gr-chip').nth(1).click() } await b.click(); await p.waitForTimeout(400) }
  const cardOnly = async () => { await p.locator('.gr-answer').last().getByText('Card', { exact: true }).click().catch(() => log('no card opt')) }
  // 1) supplier down
  await nav(3); await toggle('Supplier is down')
  await openCheckout('Noise-cancelling headphones'); const m0 = await money()
  await click(/^Pay /); await confirm(); await full('supplier-down'); log('supplier down money', JSON.stringify(m0), '->', JSON.stringify(await money()), (await h.lastText()).slice(0, 300))
  await toggle('Supplier is down')
  // 2) card declined
  await toggle('Card is declined')
  await openCheckout('Noise-cancelling headphones'); await cardOnly(); const m1 = await money()
  await click(/^Pay /); await confirm(); await full('declined'); log('declined money', JSON.stringify(m1), '->', JSON.stringify(await money()), (await h.lastText()).slice(0, 300))
  await toggle('Card is declined')
  // 3) buy with card, earn points, spend points, cancel card purchase
  await openCheckout('Noise-cancelling headphones'); await cardOnly(); const m2 = await money()
  await click(/^Pay /); await confirm(); const m3 = await money(); log('card buy', JSON.stringify(m2), '->', JSON.stringify(m3))
  // spend all points on something
  await ask('Donate points to charity'); await p.locator('.gr-answer').last().locator('.gr-btn').first().click(); await p.waitForTimeout(400); log('donate sheet', (await sheet() || '').replace(/\s+/g, ' ').slice(0, 200)); await confirm(); const m4 = await money(); log('after donate', JSON.stringify(m4))
  // spend nearly all remaining points via a points-paid purchase
  await openCheckout('A cabin suitcase'); await full('suitcase-checkout'); await click(/^Pay /); await confirm(); const m5 = await money(); log('after suitcase', JSON.stringify(m5))
  await ask('cancel my headphones'); await full('cancel-ask'); log('cancel ask', (await h.lastText()).slice(0, 400))
  await click('Yes, cancel'); await full('cancelled'); const m6 = await money(); log('after cancel', JSON.stringify(m6), (await h.lastText()).slice(0, 400))
  const s = await h.st(); log('ledger tail', JSON.stringify((s.ledger || s.points || []).slice(0, 6)).slice(0, 800))
  // 4) old buttons: scroll to first headphones checkout and try the pay button again
  const pays = p.getByRole('button', { name: /^Pay / }); log('pay buttons live:', await pays.count())
  for (let i = 0; i < await pays.count(); i++) { const b = pays.nth(i); log('pay btn', i, await b.innerText(), 'disabled=', await b.isDisabled()) }
  const yes = p.getByRole('button', { name: 'Yes, cancel' }); log('yes-cancel live:', await yes.count())
  await p.reload(); await p.waitForTimeout(800); await nav(3)
  const pays2 = p.getByRole('button', { name: /^Pay / }); log('after reload pay buttons:', await pays2.count())
  for (let i = 0; i < await pays2.count(); i++) { const b = pays2.nth(i); log('pay btn', i, await b.innerText(), 'disabled=', await b.isDisabled()) }
  await nav(5); await full('me-ledger')
}, { m, tag: 'demo1' })
