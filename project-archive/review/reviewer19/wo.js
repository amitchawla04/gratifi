require('./h.js')('UK', async (h) => {
  const { p, ask, click, full, confirm, nav, st, log, ans, shot, sheet } = h
  await nav(3)
  await ask('Noise-cancelling headphones'); await ans().locator('.gr-itemrow').first().click(); await p.waitForTimeout(300)
  await ans().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(400)
  await ans().getByText('on card ending').last().click(); await p.waitForTimeout(300)
  await p.getByRole('button', { name: /^Pay / }).last().click(); await confirm()
  let s = await st(); log('after buy pts', s.balance, 'card', s.card.balance, 'avail', s.card.limit - s.card.balance)
  // donate most points
  await ask('Donate 48300 points to charity'); await p.waitForTimeout(300)
  log('DON ' + (await h.lastText()).replace(/\n+/g,' | ').slice(0,300))
  if (!(await p.$('.app-sheet'))) { await ans().locator('.gr-btn').first().click(); await p.waitForTimeout(400) }
  await confirm()
  s = await st(); log('after donate pts', s.balance)
  await ask('cancel my headphones'); await full('wo-ask')
  await click('Yes, cancel'); await p.waitForTimeout(500)
  log('CANCEL ' + (await h.lastText()).replace(/\n+/g,' | ').slice(0,500)); await full('wo-done')
  s = await st(); log('after cancel pts', s.balance, 'card', s.card.balance); log(JSON.stringify(s.ledger.slice(0,5)))
  await nav(5); await full('wo-me')
}, { name: 'wo', len: 500 })
