const setup = require('./h.js'); const L = require('./lib.js')
module.exports = async () => { const h = await setup('UK', { tag: 'mm6' }); const { p, shot, nav, ask, btn, confirm, st, lastText, last } = h
  await nav(3); await L.bookFlight(h)
  const s1 = await L.summ(h)
  await p.reload(); await p.waitForTimeout(700); await nav(3)
  const btns = await p.evaluate(() => [...document.querySelectorAll('.gr-answer button')].filter(b => !b.disabled && getComputedStyle(b).pointerEvents !== 'none').map(b => (b.getAttribute('aria-label') || b.textContent).trim().slice(0, 30)))
  console.log('ENABLED AFTER RELOAD', btns.length, JSON.stringify(btns.slice(0, 60)))
  // click old flight card & old fare continue
  await p.locator('.gr-flight').first().click(); await p.waitForTimeout(500); console.log('OLD FLIGHT CLICK', (await lastText()).slice(0, 200))
  const c = p.getByRole('button', { name: /Continue with/ }).first(); console.log('first continue enabled', await c.isEnabled())
  console.log(JSON.stringify(s1) === JSON.stringify(await L.summ(h)) ? 'state unchanged' : 'STATE CHANGED')
  await h.close() }
