const setup = require('./h.js')
;(async () => {
  const H = await setup('UK', { tag: 'a11y', q: '&tab=chat' })
  const { p, ask, btn, shot, tall, lastAnswer, nav } = H
  await ask('Flights to Lisbon next weekend for two'); await ask('What do I owe?')
  const r = await p.evaluate(() => {
    const out = {}
    out.live = [...document.querySelectorAll('[aria-live],[role=log],[role=status],[role=alert]')].map(e => e.tagName + '.' + e.className.slice(0, 30) + ' live=' + e.getAttribute('aria-live') + ' role=' + e.getAttribute('role'))
    out.noname = [...document.querySelectorAll('button,[role=button],a,input,[role=switch],[role=radio],[role=tab]')].filter(e => !(e.getAttribute('aria-label') || e.innerText.trim() || e.getAttribute('aria-labelledby') || e.getAttribute('title') || (e.labels && e.labels.length) || e.getAttribute('placeholder'))).map(e => e.outerHTML.slice(0, 120))
    out.imgs = [...document.querySelectorAll('img')].filter(i => !i.hasAttribute('alt')).length
    out.flightCard = document.querySelector('.gr-flight')?.tagName + ' role=' + document.querySelector('.gr-flight')?.getAttribute('role') + ' tabindex=' + document.querySelector('.gr-flight')?.getAttribute('tabindex')
    out.itemrow = null
    out.pxFonts = [...document.styleSheets].flatMap(s => { try { return [...s.cssRules] } catch (e) { return [] } }).filter(r => r.style && /\d+px/.test(r.style.fontSize || '')).map(r => r.selectorText + ':' + r.style.fontSize).slice(0, 20)
    out.lang = document.documentElement.lang
    return out
  })
  console.log(JSON.stringify(r, null, 1))
  // keyboard: tab from ask box backward into flight cards; press Enter on a flight card
  await p.focus('.gr-ask input'); const seq = []; for (let i = 0; i < 12; i++) { await p.keyboard.press('Shift+Tab'); seq.push(await p.evaluate(() => { const a = document.activeElement; const cs = getComputedStyle(a); return (a.getAttribute('aria-label') || a.innerText || a.tagName).slice(0, 25).replace(/\n/g, ' ') + (cs.outlineStyle !== 'none' || cs.boxShadow !== 'none' ? '' : ' [NO-FOCUS-STYLE]') })) } console.log('shift-tab', seq.join(' | '))
  // text size 150%
  await p.evaluate(() => document.documentElement.style.fontSize = '150%'); await p.waitForTimeout(300); await nav(1); await shot('home-150'); await nav(3); await shot('chat-150', true); await nav(5); await shot('me-150')
  const ov = await p.evaluate(() => document.documentElement.scrollWidth > window.innerWidth || [...document.querySelectorAll('.app-main *')].some(e => e.scrollWidth > e.clientWidth + 2 && getComputedStyle(e).overflowX === 'visible' && e.clientWidth > 0 && !e.closest('.gr-hscroll,.gr-slots,.gr-rail')))
  console.log('overflow at 150%', ov)
  await H.done()
})()
