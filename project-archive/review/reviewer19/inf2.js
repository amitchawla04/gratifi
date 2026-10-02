require('./h.js')('UK', async (h) => {
  const { p, ask, click, full, confirm, nav, st, log, ans, shot, sheet } = h
  await nav(3)
  await ask('flights to barcelona on 14 october returning 16 october, 1 adult and a baby')
  await ans().locator('.gr-flight').first().click(); await p.waitForTimeout(400)
  await ans().locator('.gr-btn', { hasText: 'Continue with' }).click(); await p.waitForTimeout(400)
  const ins = ans().locator('input'); await ins.nth(1).fill('Baby Chawla'); await ins.nth(2).fill('2024-10-17')
  await ans().locator('.gr-btn').last().click(); await p.waitForTimeout(500)
  log('CO ' + (await h.lastText()).replace(/\n+/g, ' | ').slice(0, 300))
  await p.getByRole('button', { name: /^Pay / }).last().click(); await confirm()
  // change return to 18 Oct (infant turns 2 on 17 Oct)
  await ask('move my return flight to the 18th'); await full('inf2-change')
  log('CH ' + (await h.lastText()).replace(/\n+/g, ' | ').slice(0, 600))
  const btn = ans().locator('.gr-btn').last(); log('btn ' + await btn.innerText() + ' dis=' + await btn.isDisabled())
  if (!(await btn.isDisabled())) { await btn.click(); await p.waitForTimeout(500); log('AFTER ' + (await h.lastText()).replace(/\n+/g, ' | ').slice(0, 400)); if (await p.$('.app-sheet')) { log('SHEET ' + await sheet()) } }
  await p.keyboard.press('Escape')
  await ask('change my return flight to 20 october'); log('btn2 ' + await ans().locator('.gr-btn').last().innerText())
}, { name: 'inf2', len: 500 })
