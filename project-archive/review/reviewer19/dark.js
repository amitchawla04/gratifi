const M = process.argv[2] || 'UK'
require('./h.js')(M, async (h) => {
  const { p, ask, click, full, confirm, nav, st, log, ans, shot, sheet } = h
  await nav(3); await ask(M === 'AR' ? 'رحلات إلى مسقط نهاية الأسبوع القادم لشخصين' : 'Flights to Lisbon next weekend for two'); await shot('fl')
  await ans().locator('.gr-flight').first().click(); await p.waitForTimeout(400)
  await ans().locator('.gr-btn').last().click(); await p.waitForTimeout(400); await shot('seats')
  await ans().locator('input').nth(1).fill('Sam Taylor'); await ans().locator('.gr-btn').last().click(); await p.waitForTimeout(500)
  await p.locator('.gr-answer').last().locator('.gr-btn').last().click(); await p.waitForTimeout(500); await shot('sheet')
  await confirm(); await nav(4); await shot('wallet')
}, { name: 'dark-' + M, theme: 'dark' })
