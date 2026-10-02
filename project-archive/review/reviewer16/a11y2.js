const setup = require('./h.js')
module.exports = async () => { const h = await setup('UK', { tag: 'a11y2' }); const { p, shot, nav, ask, btn, last } = h
  await nav(3); await ask('Flights to Lisbon 16 Oct back 20 Oct for 2'); 
  await p.focus('.gr-flight'); await p.keyboard.press('Tab'); await p.keyboard.press('Shift+Tab'); await p.waitForTimeout(200)
  const d = await p.evaluate(() => { const e = document.activeElement; const cs = getComputedStyle(e); e.scrollIntoView({block:'center'}); return e.className + ' | ' + cs.outline + ' | ' + cs.boxShadow }); console.log(d)
  await p.screenshot({ path: 'shots/focus1.png' })
  await nav(4); await p.keyboard.press('Tab'); await p.keyboard.press('Tab'); await p.waitForTimeout(200); console.log(await p.evaluate(() => { const e = document.activeElement; const cs = getComputedStyle(e); return e.className + ' | ' + e.textContent.slice(0,20) + ' | ' + cs.outline + ' | ' + cs.boxShadow }))
  await p.screenshot({ path: 'shots/focus2.png' })
  await h.close() }
