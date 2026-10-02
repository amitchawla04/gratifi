const H = require('./h.js')
H.run(async (h) => {
  const { p, ask, click, full, shot, confirm, money, log, sheet, nav } = h
  const A = () => p.locator('.gr-answer').last()
  await nav(3)
  await ask('Noise-cancelling headphones'); await A().locator('.gr-itemrow').first().click(); await p.waitForTimeout(300)
  await A().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(400)
  await A().getByText('Card', { exact: true }).click()
  const m0 = await money()
  await click(/^Pay /)
  const btn = p.locator('.app-sheet .gr-btn').last()
  await Promise.all([btn.click().catch(() => {}), btn.click({ force: true }).catch(() => {}), btn.dblclick({ force: true }).catch(() => {})])
  await p.waitForTimeout(2500)
  log('after triple click', JSON.stringify(m0), '->', JSON.stringify(await money()))
  // reopen same checkout pay again (old checkout button)
  const pb = p.getByRole('button', { name: /^Pay / }); log('pay buttons remaining', await pb.count())
  // second tab: open same page in another tab, pay same checkout from stale tab
  await ask('A cabin suitcase'); await A().locator('.gr-itemrow').first().click(); await p.waitForTimeout(300); await A().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(400)
  const p2 = await h.ctx.newPage(); await p2.goto(h.url('&tab=chat')); await p2.waitForTimeout(800)
  const pb2 = p2.getByRole('button', { name: /^Pay / }).last(); log('tab2 pay btns', await p2.getByRole('button', { name: /^Pay / }).count())
  await click(/^Pay /); await confirm(); const m1 = await money(); log('paid in tab1', JSON.stringify(m1))
  if (await pb2.count()) { await pb2.scrollIntoViewIfNeeded(); await pb2.click(); await p2.waitForTimeout(400); const s2 = await p2.$('.app-sheet'); log('tab2 sheet', s2 ? (await s2.innerText()).replace(/\s+/g, ' ').slice(0, 200) : 'none'); if (s2) { await p2.locator('.app-sheet .gr-btn').last().click(); await p2.waitForTimeout(1500) } log('after tab2 pay', JSON.stringify(await money()), 'tab2 text:', (await p2.evaluate(() => [...document.querySelectorAll('.gr-answer')].pop()?.innerText || '')).slice(-300).replace(/\s+/g, ' ')) }
  const s = await h.st(); log('bookings', s.bookings.map(b => b.title + ':' + b.status).join(' | '))
}, { m: 'UK', tag: 'race' })
