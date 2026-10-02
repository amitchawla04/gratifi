const C = require('./book.js').C
require('./lib.js')('AR', 'scan', async (h) => {
  const { p } = h
  const seen = new Set()
  const grab = async (tag) => { const t = await p.locator('.app').innerText(); const s = await h.sheet(); for (const x of (t + ' ' + (s || '')).split('\n')) { const w = x.trim(); if (/[A-Za-z]{3,}/.test(w) && !seen.has(w)) { seen.add(w); console.log(tag, '|', w.slice(0, 140)) } } }
  await grab('home'); await h.nav(2); await grab('explore')
  const n = await p.locator('.gr-cattile').count(); for (let i = 0; i < n; i++) { await C(p.locator('.gr-cattile').nth(i)); await p.waitForTimeout(250); await grab('cat' + i); await C(p.locator('.app-main [aria-label], .app-main .gr-ibtn').first()); await p.waitForTimeout(150) }
  await h.nav(4); await grab('wallet'); await h.nav(5); await grab('me')
  await h.nav(3)
  for (const q of ['تأمين السفر', 'فيزا مسقط', 'شريحة بيانات eSIM', 'بطاقة هدية', 'اشتراكات', 'حفلات', 'تحويل النقاط', 'تبرع بالنقاط', 'استثمر النقاط في الذهب', 'تحديات', 'مزايا البطاقة', 'عروض البطاقة', 'كشف الحساب', 'ضوابط البطاقة', 'طلب للكونسيرج', 'صالة المطار', 'تاكسي', 'قطار', 'استئجار سيارة', 'تجارب في مسقط', 'فندق في مسقط', 'طاولة الليلة', 'بقالة']) { await h.ask(q); await grab(q) }
  await C(h.last().locator('.gr-itemrow').first()).catch(()=>{})
})
