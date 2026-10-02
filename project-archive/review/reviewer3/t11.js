(async () => {
  const H = await require('./h.js')('UK', 'dark', 'dk')
  const { p, full, nav, ask, click, last, st, lastMsg, done, shot } = H
  await full('home'); await nav(2)
  const n = await p.locator('.gr-cattile').count(); console.log('cats', n)
  for (const i of [0, 12, 16, 17, 18]) { await p.locator('.gr-cattile').nth(i).click(); await p.waitForTimeout(300); await full('cat' + i); await p.locator('.app-main [aria-label="Back"]').first().click(); await p.waitForTimeout(200) }
  await nav(3); await ask('Flights to Lisbon next weekend for two'); await p.locator('.gr-flight').first().click(); await p.waitForTimeout(400); await click(/Continue with/); await full('fl-dark')
  await last().locator('.app-in:not([disabled])').first().fill('Sam Taylor'); await click('Continue', { exact: true }); await p.getByRole('button', { name: /^Pay / }).last().click(); await p.waitForTimeout(400); await shot('sheet-dark')
  await p.keyboard.press('Escape'); await p.waitForTimeout(300); console.log('esc closes sheet?', !(await p.$('.app-sheet'))); const foc = await p.evaluate(() => document.activeElement && (document.activeElement.className + ' ' + document.activeElement.tagName)); console.log('focus in sheet', foc); const dlg = await p.evaluate(() => { const s = document.querySelector('.app-sheet *[role=dialog], .app-sheet [aria-modal]'); return s ? s.outerHTML.slice(0,100) : 'no dialog role' }); console.log(dlg); await p.locator('.app-sheet button[aria-label]').first().click().catch(()=>{}); await p.mouse.click(200,50); await p.waitForTimeout(300)
  await nav(5); await full('me-dark'); await nav(4); await full('wallet-dark')
  // accessibility probes
  const a11y = await p.evaluate(() => { const out = []; document.querySelectorAll('button, [role=button], input, a').forEach(el => { const name = (el.getAttribute('aria-label') || el.innerText || el.getAttribute('placeholder') || el.title || '').trim(); if (!name) out.push(el.outerHTML.slice(0, 120)) }); return out })
  console.log('unnamed controls', a11y.length, a11y.slice(0, 10))
  const nav5 = await p.evaluate(() => [...document.querySelectorAll('.gr-nav button')].map(b => (b.getAttribute('aria-label') || b.innerText) + '|' + b.getAttribute('aria-current')))
  console.log('nav', nav5)
  console.log(await done())
})()
