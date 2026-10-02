require('./h.js')('UK', async (h) => {
  const { p, ask, click, full, confirm, nav, st, log, ans, shot, sheet } = h
  await nav(5); await click('Turn on'); await p.waitForTimeout(400); log('SHEET? ' + await sheet()); if (await p.$('.app-sheet')) await confirm()
  log('ME ' + (await p.locator('.app-main').innerText()).replace(/\n+/g, ' | ').slice(0, 400))
  await nav(3); await ask('lift the gambling block'); log('SHEET ' + await sheet()); if (await p.$('.app-sheet')) await confirm()
  log('AFTER ' + (await h.lastText()).replace(/\n+/g,' | ').slice(0,400))
  await nav(5); await full('gam-me'); log('ME2 ' + (await p.locator('.app-main').innerText()).replace(/\n+/g, ' | ').slice(0, 400))
  await nav(3); await ask('keep the block on'); await ask('I need to place a bet on the football tonight'); await ask('can I use my card at a casino in Vegas')
}, { name: 'gam', len: 400 })
