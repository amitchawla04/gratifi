require('./h.js')('UK', async (h) => {
  const { p, ask, click, full, confirm, nav, st, log, ans, shot, sheet } = h
  await nav(3)
  await ask('lower my limit to 1000'); log('SHEET ' + await sheet()); await confirm()
  log('card ' + JSON.stringify((await st()).card))
  await ask('Noise-cancelling headphones'); await ans().locator('.gr-itemrow').first().click(); await p.waitForTimeout(300)
  await ans().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(400)
  await ans().getByRole('button', { name: /^Card/ }).click().catch(e => log('no card opt ' + e.message.slice(0,80))); await p.waitForTimeout(300)
  log('CHECKOUT ' + (await h.lastText()).replace(/\n+/g, ' | ').slice(-500)); await full('credit-co')
  const pay = p.getByRole('button', { name: /^Pay / }).last(); log('pay disabled? ' + await pay.isDisabled().catch(()=> 'none'))
  await pay.click().catch(()=>{}); await p.waitForTimeout(500); log('SHEET2 ' + await sheet()); await shot('credit-sheet')
  if (await p.$('.app-sheet')) { await confirm(); log('AFTER ' + (await h.lastText()).replace(/\n+/g, ' | ').slice(0, 400)) }
  log('card ' + JSON.stringify((await st()).card))
  // partial pay bill
  await ask('pay £100 off my bill'); log('SHEET3 ' + await sheet()); await confirm()
  await ask('what do I owe?'); 
  await ask('pay £900 off my card'); log('SHEET4 ' + await sheet()); await p.keyboard.press('Escape')
  await ask('raise my limit back to 8000');
  log('card ' + JSON.stringify((await st()).card))
}, { name: 'credit', len: 500 })
