require('./h.js')('UK', async (h) => {
  const { p, ask, click, full, confirm, nav, st, log, ans, shot, sheet } = h
  await nav(3)
  await ask('lower my limit to 1000'); await confirm()
  await ask('Noise-cancelling headphones'); await ans().locator('.gr-itemrow').first().click(); await p.waitForTimeout(300)
  await ans().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(400)
  await ans().getByText('on card ending').last().click(); await p.waitForTimeout(400)
  log('CHECKOUT ' + (await h.lastText()).replace(/\n+/g, ' | ').slice(-300)); await full('credit-co')
  const pay = p.getByRole('button', { name: /^Pay / }).last(); log('pay disabled? ' + await pay.isDisabled().catch(()=> 'none'))
  await pay.click().catch(()=>{}); await p.waitForTimeout(500); log('SHEET2 ' + await sheet());
  if (await p.$('.app-sheet')) { await confirm(); log('AFTER ' + (await h.lastText()).replace(/\n+/g, ' | ').slice(0, 400)) }
  await ans().getByText('Points and card').last().click().catch(()=>log('no mix')); await p.waitForTimeout(300)
  log('MIX ' + (await h.lastText()).replace(/\n+/g, ' | ').slice(-300))
  await full('credit-mix')
  log('card ' + JSON.stringify((await st()).card) + ' pts ' + (await st()).balance)
}, { name: 'credit2', len: 500 })
