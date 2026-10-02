require('./h.js')('UK', async (h) => {
  const { p, ask, click, full, confirm, nav, st, log, ans, shot, sheet } = h
  await nav(3)
  await ask('Milk, eggs and bread'); await ask('remove the bread and add 3 bananas'); await ask('make it 2 milk and no eggs')
  await click('Checkout'); await p.getByRole('button', { name: /^Pay / }).last().click(); await confirm()
  await nav(5); await click('Deliver my order'); await nav(3)
  await ask('the milk was missing from my groceries'); await full('gclaim')
  log('GCL ' + (await h.lastText()).replace(/\n+/g, ' | ').slice(0, 600))
  const b = ans().locator('.gr-btn').last(); log('btn ' + await b.innerText()); await b.click().catch(()=>{}); await p.waitForTimeout(600)
  log('GCL2 ' + (await h.lastText()).replace(/\n+/g, ' | ').slice(0, 400)); let s = await st(); log('pts', s.balance)
  // subs
  await ask('Start a streaming subscription'); await ans().locator('.gr-itemrow').first().click(); await p.waitForTimeout(300); await ans().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(300)
  await p.getByRole('button', { name: /^Pay / }).last().click(); await confirm()
  await ask('cancel Screenly'); log('SC ' + (await h.lastText()).replace(/\n+/g, ' | ').slice(0, 500)); await click('Yes, cancel').catch(()=>log('no yes')); log('SC2 ' + (await h.lastText()).replace(/\n+/g, ' | ').slice(0, 400))
  await ask('what am I paying for?')
  // supplier down
  await nav(5); await p.locator('.app-demo [role=switch]').nth(1).click(); await nav(3)
  s = await st(); const before = JSON.stringify([s.balance, s.card.balance, s.bookings.length])
  await ask('Noise-cancelling headphones'); await ans().locator('.gr-itemrow').first().click(); await p.waitForTimeout(300); await ans().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(300)
  await p.getByRole('button', { name: /^Pay / }).last().click(); await p.waitForTimeout(400); if (await p.$('.app-sheet')) await confirm()
  log('DOWN ' + (await h.lastText()).replace(/\n+/g, ' | ').slice(0, 400)); s = await st(); log('before', before, 'after', JSON.stringify([s.balance, s.card.balance, s.bookings.length]))
  await full('down')
}, { name: 'misc', len: 400 })
