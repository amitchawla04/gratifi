const H = require('./h.js')
const m = process.argv[2] || 'UK'
H.run(async (h) => {
  const { p, ask, click, full, shot, confirm, log, nav } = h
  await p.addStyleTag({ content: 'html{font-size:200% !important}' })
  const over = async (tag) => { const r = await p.evaluate(() => { const W = document.documentElement.clientWidth; const bad = []; document.querySelectorAll('.app *').forEach(e => { const b = e.getBoundingClientRect(); if (b.width > 0 && (b.right > W + 2 || b.left < -2) && !e.closest('.gr-hscroll,.gr-rail,[class*=scroll],[class*=rail],[class*=chips]')) bad.push((e.className || e.tagName).toString().slice(0, 40) + ':' + Math.round(b.right)) }); return { sw: document.scrollingElement.scrollWidth, W, bad: bad.slice(0, 8) } }); log(tag, JSON.stringify(r)) }
  await shot('home'); await over('home')
  await nav(2); await shot('explore'); await over('explore')
  await nav(3); await ask('Flights to Lisbon next weekend for two'); await shot('flights'); await over('flights')
  await p.locator('.gr-flight').first().click(); await p.waitForTimeout(400); await shot('fares'); await over('fares')
  await click(/Continue with/); { const ins = p.locator('.gr-answer').last().locator('input.app-in'); for (let i = 0; i < await ins.count(); i++) { if (!(await ins.nth(i).inputValue())) await ins.nth(i).fill('Sam Taylor') } } await shot('seats'); await over('seats')
  await click('Continue', { exact: true }); await shot('checkout'); await over('checkout')
  await click(/^Pay /); await shot('sheet'); await over('sheet'); await p.keyboard.press('Escape')
  await nav(4); await shot('wallet'); await over('wallet')
  await nav(5); await shot('me'); await over('me')
}, { m, tag: 'zoom' })
