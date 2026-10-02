const M = process.argv[2] || 'UK'
require('./h.js')(M, async (h) => {
  const { p, ask, click, full, confirm, nav, st, log, ans, shot } = h
  await p.addStyleTag({ content: 'html{font-size:200% !important}' }); await p.waitForTimeout(400)
  const ov = async (tag) => { const r = await p.evaluate(() => { const W = document.documentElement.clientWidth; const bad = []; document.querySelectorAll('body *').forEach(e => { const b = e.getBoundingClientRect(); if (b.width > 0 && (b.right > W + 1 || b.left < -1) && getComputedStyle(e).position !== 'fixed' && !e.closest('[style*="overflow"], .gr-hscroll, .gr-scroll-x')) { let s = e; let clipped = false; while (s = s.parentElement) { const cs = getComputedStyle(s); if (/(auto|scroll|hidden)/.test(cs.overflowX)) { clipped = true; break } } if (!clipped) bad.push((e.className || e.tagName) + ':' + (e.innerText || '').slice(0, 30) + ':' + Math.round(b.right)) } }); return { sw: document.documentElement.scrollWidth, W, bad: bad.slice(0, 8) } }); log(tag, JSON.stringify(r)) }
  await shot('home'); await ov('home')
  await nav(2); await shot('explore'); await ov('explore')
  await nav(3); await ask('Flights to Lisbon next weekend for two'); await shot('flights'); await ov('flights')
  await ans().locator('.gr-flight').first().click(); await p.waitForTimeout(400); await shot('fares'); await ov('fares')
  await click(/Continue with/); await shot('seats'); await ov('seats')
  const ins = ans().locator('input'); await ins.nth(1).fill('Sam Taylor'); await ans().locator('.gr-btn').last().click(); await p.waitForTimeout(500)
  await shot('checkout'); await ov('checkout')
  await p.getByRole('button', { name: /^(Pay |ادفع )/ }).last().click(); await p.waitForTimeout(500); await shot('sheet'); await ov('sheet')
  await p.keyboard.press('Escape'); await nav(4); await shot('wallet'); await ov('wallet'); await nav(5); await shot('me'); await ov('me')
}, { name: 'big-' + M })
