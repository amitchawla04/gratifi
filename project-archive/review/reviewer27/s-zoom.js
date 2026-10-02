module.exports = async (h) => { const { p, say, click, nav, full, shot, sheet } = h
  const Z = async () => p.evaluate(() => { document.documentElement.style.fontSize = '200%' })
  const ov = async (tag) => { const r = await p.evaluate(() => { const W = document.documentElement.clientWidth; const bad = []; document.querySelectorAll('.app *').forEach(e => { const b = e.getBoundingClientRect(); if (b.width > 0 && (b.right > W + 1 || b.left < -1) && !e.closest('[class*=scroll-x], .gr-hscroll, .gr-slots, .gr-chips, .gr-carousel')) { const cs = getComputedStyle(e.parentElement); if (!/auto|scroll/.test(cs.overflowX)) bad.push((e.className || e.tagName) + ':' + Math.round(b.left) + '-' + Math.round(b.right) + ' ' + (e.textContent || '').slice(0, 30)) } }); return { sw: document.documentElement.scrollWidth, W, bad: bad.slice(0, 12) } }); console.log('OVERFLOW', tag, JSON.stringify(r)) }
  await Z(); await shot('home'); await ov('home')
  await nav(5); await shot('me'); await ov('me')
  await nav(3); await Z(); await say('Flights to Lisbon next Friday for two'); await shot('flights'); await ov('flights')
  await p.locator('.gr-flight').first().click(); await p.waitForTimeout(500); await shot('fares'); await ov('fares')
  await click(/Continue with/); await shot('seats'); await ov('seats')
  const ins = p.locator('.gr-answer').last().locator('input.app-in'); for (let i = 0; i < await ins.count(); i++) { if (!(await ins.nth(i).inputValue())) await ins.nth(i).fill('Sam Taylor') }
  await click('Continue', { exact: true }); await shot('checkout'); await ov('checkout')
  await click(/^Pay /); await p.waitForTimeout(500); await shot('sheet'); await ov('sheet')
}
