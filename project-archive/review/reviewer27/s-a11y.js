module.exports = async (h) => { const { p, say, click, nav } = h
  const audit = async (tag) => { const r = await p.evaluate(() => {
    const name = e => (e.getAttribute('aria-label') || e.innerText || e.getAttribute('title') || (e.querySelector('img') && e.querySelector('img').alt) || '').trim()
    const noName = [...document.querySelectorAll('button, a, [role=button], [role=switch], [role=radio]')].filter(e => e.offsetParent && !name(e)).map(e => e.outerHTML.slice(0, 120))
    const inputs = [...document.querySelectorAll('input, textarea, select')].filter(e => e.offsetParent && !(e.getAttribute('aria-label') || e.labels?.length || e.getAttribute('aria-labelledby') || e.placeholder)).map(e => e.outerHTML.slice(0, 120))
    const imgs = [...document.querySelectorAll('img')].filter(e => e.alt === undefined || e.getAttribute('alt') === null).length
    const lum = c => { const m = c.match(/[\d.]+/g).map(Number); const f = v => { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4) }; return .2126 * f(m[0]) + .7152 * f(m[1]) + .0722 * f(m[2]) }
    const bg = e => { while (e) { const c = getComputedStyle(e).backgroundColor; if (c && !/rgba\(0, 0, 0, 0\)|transparent/.test(c)) return c; e = e.parentElement } return 'rgb(255,255,255)' }
    const low = []; document.querySelectorAll('.app *').forEach(e => { if (!e.offsetParent || !e.childNodes.length || ![...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim())) return; const cs = getComputedStyle(e); if (cs.opacity === '0') return; const a = lum(cs.color), b = lum(bg(e)); const cr = (Math.max(a, b) + .05) / (Math.min(a, b) + .05); const big = parseFloat(cs.fontSize) >= 24 || (parseFloat(cs.fontSize) >= 18.6 && +cs.fontWeight >= 700); if (cr < (big ? 3 : 4.5)) low.push(cr.toFixed(2) + ' ' + e.className + ' "' + e.textContent.trim().slice(0, 30) + '" ' + cs.color + ' on ' + bg(e)) })
    const small = [...document.querySelectorAll('button, [role=switch]')].filter(e => { const b = e.getBoundingClientRect(); return e.offsetParent && (b.width < 24 || b.height < 24) }).map(e => (e.getAttribute('aria-label') || e.innerText).slice(0, 20) + ':' + Math.round(e.getBoundingClientRect().width) + 'x' + Math.round(e.getBoundingClientRect().height))
    return { noName: noName.slice(0, 6), inputs: inputs.slice(0, 6), imgsNoAlt: imgs, low: [...new Set(low)].slice(0, 12), small: small.slice(0, 8), lang: document.documentElement.lang, dir: document.documentElement.dir }
  }); console.log('A11Y', tag, JSON.stringify(r, null, 0)) }
  await audit('home'); await nav(5); await audit('me'); await nav(3); await say('Flights to Lisbon next Friday for two'); await audit('flights')
  await p.locator('.gr-flight').first().click(); await p.waitForTimeout(500); await click(/Continue with/); await audit('seats')
  const ins = p.locator('.gr-answer').last().locator('input.app-in'); for (let i = 0; i < await ins.count(); i++) { if (!(await ins.nth(i).inputValue())) await ins.nth(i).fill('Sam Taylor') }
  await click('Continue', { exact: true }); await click(/^Pay /); await p.waitForTimeout(500)
  const d = await p.evaluate(() => { const s = document.querySelector('[role=dialog]'); return { dialog: !!s, modal: s && s.getAttribute('aria-modal'), label: s && (s.getAttribute('aria-labelledby') || s.getAttribute('aria-label')), inert: [...document.querySelectorAll('[inert]')].length, focusIn: s && s.contains(document.activeElement), active: document.activeElement && document.activeElement.outerHTML.slice(0, 80) } }); console.log('DIALOG', JSON.stringify(d))
  for (let i = 0; i < 8; i++) await p.keyboard.press('Tab'); console.log('focus after tabs in sheet', await p.evaluate(() => document.querySelector('[role=dialog]').contains(document.activeElement)))
  await p.keyboard.press('Escape'); await p.waitForTimeout(300); console.log('focus returned to', await p.evaluate(() => document.activeElement.outerHTML.slice(0, 100)))
}
