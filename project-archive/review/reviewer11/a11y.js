const book = require('./book.js'), C = book.C
require('./lib.js')(process.argv[2]||'UK', 'a11y', async (h) => {
  const { p } = h
  const audit = async (tag) => console.log(tag, JSON.stringify(await p.evaluate(() => {
    const name = e => (e.getAttribute('aria-label') || e.innerText || e.getAttribute('title') || '').trim()
    const noname = [...document.querySelectorAll('button,[role=button],a,input,[role=switch],[role=radio]')].filter(e => !name(e) && !(e.labels && e.labels.length) && !e.getAttribute('placeholder') && !e.getAttribute('aria-labelledby')).map(e => e.outerHTML.slice(0, 90))
    const imgs = [...document.querySelectorAll('img,svg[role=img]')].filter(e => !e.getAttribute('alt') && !e.getAttribute('aria-label') && e.getAttribute('aria-hidden') !== 'true').length
    const small = [...document.querySelectorAll('button,[role=switch],[role=radio]')].filter(e => { const r = e.getBoundingClientRect(); return r.width > 0 && (r.height < 24 || r.width < 24) }).map(e => (e.getAttribute('aria-label') || e.innerText).slice(0, 20) + ':' + Math.round(e.getBoundingClientRect().width) + 'x' + Math.round(e.getBoundingClientRect().height))
    const live = [...document.querySelectorAll('[aria-live],[role=log],[role=status],[role=alert]')].map(e => e.className.slice(0, 30) + ':' + (e.getAttribute('aria-live') || e.getAttribute('role')))
    return { lang: document.documentElement.lang, dir: document.documentElement.dir, noname: noname.slice(0, 8), nonameN: noname.length, imgsNoAlt: imgs, small: small.slice(0, 10), live, h1: [...document.querySelectorAll('h1,h2')].map(e => e.innerText).slice(0, 5) }
  })))
  await audit('HOME'); await h.nav(5); await audit('ME'); await h.nav(3); await h.ask('Flights to Lisbon next weekend for two'); await audit('CHAT')
  await C(p.locator('.gr-flight').first()); await p.waitForTimeout(400); await h.btn(/Continue with|تابع/); await audit('SEATS')
  // sheet
  await h.ask('pay £50 off my card'); await p.waitForTimeout(300)
  console.log('SHEET', await p.evaluate(() => { const s = document.querySelector('.app-sheet'); if (!s) return 'none'; const d = s.closest('[role=dialog]') || s; return { role: d.getAttribute('role'), modal: d.getAttribute('aria-modal'), label: d.getAttribute('aria-label') || d.getAttribute('aria-labelledby'), focusInside: s.contains(document.activeElement), active: document.activeElement.outerHTML.slice(0, 80) } }))
  await p.keyboard.press('Tab'); await p.keyboard.press('Tab'); await p.keyboard.press('Tab'); await p.keyboard.press('Tab'); await p.keyboard.press('Tab')
  console.log('after tabs focus in sheet', await p.evaluate(() => document.querySelector('.app-sheet')?.contains(document.activeElement) + ' ' + document.activeElement.outerHTML.slice(0, 80)))
  await p.keyboard.press('Escape'); await p.waitForTimeout(300); console.log('esc closes', !(await p.$('.app-sheet')))
  // focus ring
  await p.keyboard.press('Tab'); await h.shot('focus')
})
