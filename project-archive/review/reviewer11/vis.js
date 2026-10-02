const book = require('./book.js'), C = book.C
const [m, theme, zoom] = process.argv.slice(2)
require('./lib.js')(m, `vis-${theme}-${zoom||'1'}`, async (h) => {
  const { p } = h
  await h.shot('home'); await h.nav(2); await h.shot('explore'); await h.nav(5); await h.shot('me')
  await h.nav(3); await h.ask(m==='AR' ? 'رحلات إلى مسقط لشخصين' : 'Flights to Lisbon next weekend for two'); await h.shot('results')
  await C(p.locator('.gr-flight').first()); await p.waitForTimeout(400); await h.shot('fares')
  await h.btn(/Continue with|تابع بالدرجة/); await h.shot('seats')
  const ins = h.last().locator('input'); for (let i = 0; i < await ins.count(); i++) if (!(await ins.nth(i).inputValue())) await ins.nth(i).fill('Sam Taylor')
  await h.btn(m==='AR'? /^تابع$/ : /^Continue$/); await h.shot('checkout')
  await h.btn(/^Pay |^ادفع /); await h.shot('sheet')
  const o = await p.$('.app-sheet input'); if (o) await o.fill('482193')
  await h.faceid(); await h.shot('receipt'); await h.nav(4); await h.shot('wallet')
  const overflow = await p.evaluate(() => { const W = document.documentElement.clientWidth; return [...document.querySelectorAll('body *')].filter(e => { const r = e.getBoundingClientRect(); return r.width > 0 && (r.right > W + 1 || r.left < -1) && !e.closest('.gr-hscroll,[class*=scroll],[class*=carousel],[class*=rail]') }).slice(0, 8).map(e => e.className + ':' + Math.round(e.getBoundingClientRect().right)) })
  console.log('overflow', overflow)
}, { theme, zoom })
