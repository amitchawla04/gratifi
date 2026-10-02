module.exports = async (h) => {
  const { p, nav, long, full, say, click, shot, log } = h
  await p.addStyleTag({ content: 'html{font-size:200% !important}' })
  const ov = async (l) => { const r = await p.evaluate(() => { const W = document.documentElement.clientWidth; const bad = []; document.querySelectorAll('.app *').forEach(e => { const r = e.getBoundingClientRect(); if (r.width && (r.right > W + 1 || r.left < -1) && getComputedStyle(e).position !== 'fixed') { const t = (e.innerText || e.getAttribute('aria-label') || e.className || '').toString().slice(0, 40); if (!e.closest('.gr-hscroll,[class*=scroll],[class*=rail],[class*=carousel]')) bad.push(e.tagName + ':' + t.replace(/\n/g, ' ')) } }); return { sw: document.documentElement.scrollWidth, W, bad: [...new Set(bad)].slice(0, 12) } }); log(l + ' ' + JSON.stringify(r)) }
  await nav(1); await ov('home'); await long('home')
  await nav(5); await ov('me'); await long('me')
  await nav(3); await say('Flights to Lisbon next weekend for two'); await ov('flights'); await full('flights')
  await p.locator('.gr-flight').first().click(); await p.waitForTimeout(400); await ov('fares'); await full('fares')
  await say('A hotel in Lisbon'); await p.locator('.gr-answer').last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(400); await ov('detail'); await full('detail')
  await p.locator('.gr-answer').last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(400); await ov('checkout'); await full('checkout')
  await click(/^Pay /); await p.waitForTimeout(400); await ov('sheet'); await shot('sheet')
}
