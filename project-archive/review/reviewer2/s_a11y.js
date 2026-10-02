module.exports = async (h) => { const { p, nav, ask, log, shot } = h
  const audit = async (tag) => { const r = await p.evaluate(() => {
    const vis = e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 }
    const els = [...document.querySelectorAll('button, a, [role=button], [role=switch], [role=tab], [role=radio], input, textarea, select, [tabindex]')].filter(vis)
    const noName = els.filter(e => !(e.getAttribute('aria-label') || e.innerText.trim() || e.getAttribute('aria-labelledby') || e.getAttribute('title') || (e.labels && e.labels.length) || e.getAttribute('placeholder'))).map(e => e.outerHTML.slice(0, 120))
    const small = els.filter(e => { const r = e.getBoundingClientRect(); return (r.width < 40 || r.height < 40) && e.tagName !== 'INPUT' }).map(e => { const r = e.getBoundingClientRect(); return `${Math.round(r.width)}x${Math.round(r.height)} ${(e.getAttribute('aria-label') || e.innerText).trim().slice(0, 30)}` })
    const divClick = [...document.querySelectorAll('div,span,li')].filter(e => (e.onclick || getComputedStyle(e).cursor === 'pointer') && !e.closest('button,a,[role]') && vis(e) && e.getAttribute('tabindex') === null).map(e => e.className + ':' + e.innerText.slice(0, 30)).slice(0, 15)
    const imgs = [...document.querySelectorAll('img,svg')].filter(e => e.tagName === 'IMG' && !e.hasAttribute('alt')).length
    return { count: els.length, noName: noName.slice(0, 12), small: [...new Set(small)].slice(0, 25), divClick, imgsNoAlt: imgs, live: document.querySelectorAll('[aria-live]').length, main: !!document.querySelector('main'), h1: [...document.querySelectorAll('h1')].map(e => e.innerText) }
  }); log(tag, JSON.stringify(r, null, 1)) }
  await audit('home'); await nav(3); await ask('Flights to Lisbon next weekend for two'); await audit('chat-flights')
  await p.locator('.gr-answer').last().locator('.gr-flight').first().click(); await p.waitForTimeout(400); await audit('fares')
  await nav(5); await audit('me')
  // keyboard focus
  await nav(1); await p.keyboard.press('Tab'); await p.keyboard.press('Tab'); await p.keyboard.press('Tab'); await shot('focus3'); log('focused', await p.evaluate(() => { const e = document.activeElement; const cs = getComputedStyle(e); return [e.tagName, e.className, (e.innerText || e.getAttribute('aria-label') || '').slice(0, 30), cs.outlineStyle, cs.outlineWidth, cs.boxShadow.slice(0, 60)] }))
}
