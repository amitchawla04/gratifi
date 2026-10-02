module.exports = async (h) => { const { p } = h
  await p.addStyleTag({ content: 'html{font-size:200% !important}' }); await p.waitForTimeout(300)
  const ov = async (n) => { const r = await p.evaluate(() => { const W = document.documentElement.clientWidth; const bad = []; document.querySelectorAll('body *').forEach(e => { const b = e.getBoundingClientRect(); if (b.width && (b.right > W + 1 || b.left < -1) && getComputedStyle(e).position !== 'fixed' && !e.closest('[style*=overflow], .gr-hscroll, .gr-rail, .gr-chips, .gr-slots, .gr-days, .gr-scroll')) bad.push((e.className || e.tagName).toString().slice(0, 40) + ':' + Math.round(b.right)) }); return { sw: document.documentElement.scrollWidth, W, bad: [...new Set(bad)].slice(0, 12) } }); console.log('OVERFLOW', n, JSON.stringify(r)) }
  await h.shot('home'); await ov('home')
  await h.nav(3); await h.ask('Rain shell jacket'); await p.locator('.gr-answer').last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(400); await h.shot('detail'); await ov('detail')
  await p.locator('.gr-answer').last().locator('.gr-chip').nth(1).click().catch(e => console.log('chip', e.message.slice(0, 80))); await p.waitForTimeout(200)
  const cta = p.locator('.gr-answer').last().locator('.gr-detail .gr-btn').last(); await cta.scrollIntoViewIfNeeded(); await cta.click(); await p.waitForTimeout(500); await h.shot('checkout'); await ov('checkout')
  await h.click(/^(Pay |ادفع )/); await p.waitForTimeout(500); await h.shot('sheet'); await ov('sheet')
  await p.keyboard.press('Escape'); await p.waitForTimeout(300)
  await h.nav(5); await h.shot('me'); await ov('me')
  await h.nav(4); await h.shot('wallet'); await ov('wallet')
}
