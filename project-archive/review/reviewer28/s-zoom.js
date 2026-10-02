module.exports = async (h) => { const { p, nav, shot, ask, click } = h
  await p.addStyleTag({ content: 'html{font-size:200% !important}' }); await p.waitForTimeout(300)
  const ov = async (l) => { const r = await p.evaluate(() => { const W = document.documentElement.clientWidth; const bad = []; document.querySelectorAll('.app *').forEach(e => { const b = e.getBoundingClientRect(); if (b.width > 0 && (b.right > W + 2 || b.left < -2) && getComputedStyle(e).position !== 'fixed' && !e.closest('[class*=scroll-x],.gr-hscroll,.gr-rail,.gr-dates,.gr-chips-scroll')) bad.push((e.className||e.tagName).toString().slice(0,40) + ':' + (e.innerText||'').slice(0,30).replace(/\n/g,' ')) }); return { sw: document.documentElement.scrollWidth, W, bad: bad.slice(0, 8) } }); console.log(l, JSON.stringify(r)) }
  await shot('home'); await ov('home')
  await nav(3); await ask('Flights to Lisbon next weekend for two', 900); await shot('flights'); await ov('flights')
  await p.locator('.gr-flight').first().click(); await p.waitForTimeout(500); await shot('fares'); await ov('fares')
  await ask('Noise-cancelling headphones'); await p.locator('.gr-answer').last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(400); await shot('detail'); await ov('detail')
  await p.locator('.gr-answer').last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(400); await shot('checkout'); await ov('checkout')
  await p.getByRole('button', { name: /^(Pay |ادفع )/ }).last().click(); await p.waitForTimeout(500); await shot('sheet'); await ov('sheet'); await p.keyboard.press('Escape')
  await nav(5); await shot('me'); await ov('me'); await nav(4); await shot('wallet'); await ov('wallet')
}
