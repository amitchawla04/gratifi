const H = require('./h.js')
H.run(async (h) => {
  const { p, ask, click, full, shot, confirm, money, log, sheet, nav } = h
  const A = () => p.locator('.gr-answer').last()
  await nav(3)
  // hotel tomorrow, then cancel
  await ask('a hotel in Lisbon tomorrow for 2 nights'); log('list:', (await h.lastText()).slice(0, 200))
  const row = A().locator('.gr-itemrow').first(); log('row:', (await row.innerText()).replace(/\s+/g, ' '))
  await row.click(); await p.waitForTimeout(400); await full('hotel-detail'); log('detail:', (await A().innerText()).replace(/\s+/g, ' ').slice(0, 500))
  await A().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(400); log('checkout:', (await A().innerText()).replace(/\s+/g, ' ').slice(0, 400))
  await A().getByText('Card', { exact: true }).click().catch(() => {})
  await click(/^Pay /); log('sheet:', (await sheet() || '').replace(/\s+/g, ' ').slice(0, 300)); await confirm(); await full('hotel-paid')
  await ask('cancel my hotel'); await full('hotel-cancel'); log('cancel:', (await A().innerText()).replace(/\s+/g, ' ').slice(0, 400))
  await p.keyboard.press('Escape')
  // dining stepper limit
  await ask('A table tonight for two'); await A().locator('.gr-itemrow').first().click(); await p.waitForTimeout(300)
  const plus = A().locator('.gr-detail button[aria-label*="more" i], .gr-detail button[aria-label*="add" i], .gr-detail button:has-text("+")')
  log('plus count', await plus.count())
  for (let i = 0; i < 12; i++) { await plus.first().click().catch(() => {}); await p.waitForTimeout(60) }
  await full('dining-13'); log('dining detail:', (await A().innerText()).replace(/\s+/g, ' ').slice(0, 500))
  // clothes via list button path
  await ask('Leather trainers'); await A().locator('.gr-itemrow').first().click(); await p.waitForTimeout(300); log('trainers btn:', await A().locator('.gr-detail .gr-btn').last().innerText(), 'disabled', await A().locator('.gr-detail .gr-btn').last().isDisabled())
  // gift card detail button without email
  await ask('A gift card for a friend'); await A().locator('.gr-itemrow').first().click(); await p.waitForTimeout(300); log('gift btn:', await A().locator('.gr-detail .gr-btn').last().innerText(), 'disabled', await A().locator('.gr-detail .gr-btn').last().isDisabled())
  await A().locator('.app-in').nth(0).fill('Sam'); await A().locator('.app-in').nth(1).fill('sam@'); await p.waitForTimeout(200); log('gift btn bad email:', await A().locator('.gr-detail .gr-btn').last().innerText(), 'disabled', await A().locator('.gr-detail .gr-btn').last().isDisabled())
}, { m: 'UK', tag: 'misc1' })
