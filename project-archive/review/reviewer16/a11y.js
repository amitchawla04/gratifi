const setup = require('./h.js')
module.exports = async () => { const h = await setup('UK', { tag: 'a11y' }); const { p, shot, nav, ask, btn, last } = h
  await nav(3); await ask('Flights to Lisbon 16 Oct back 20 Oct for 2'); await p.locator('.gr-flight').first().click(); await p.waitForTimeout(400); await btn(/Continue with/)
  const r = await p.evaluate(() => { const out = {}; const s = document.querySelector('button[aria-label^="Seat 13C"]').getBoundingClientRect(); out.seat = [s.width, s.height]; 
    const small = []; document.querySelectorAll('button, a, input, [role=radio], [role=switch]').forEach(e => { const b = e.getBoundingClientRect(); if (b.width && b.height && (b.width < 24 || b.height < 24)) small.push((e.getAttribute('aria-label') || e.textContent).slice(0, 30) + ' ' + Math.round(b.width) + 'x' + Math.round(b.height)) }); out.small = [...new Set(small)].slice(0, 30);
    const unl = []; document.querySelectorAll('button').forEach(e => { if (!(e.getAttribute('aria-label') || e.textContent.trim())) unl.push(e.className) }); out.unlabelled = unl.slice(0, 10);
    out.lang = document.documentElement.lang; out.live = [...document.querySelectorAll('[aria-live]')].map(e => e.className + ':' + e.getAttribute('aria-live')); return out })
  console.log(JSON.stringify(r, null, 1))
  // keyboard: tab through first 15
  const seq = []; await p.keyboard.press('Escape'); for (let i = 0; i < 12; i++) { await p.keyboard.press('Tab'); seq.push(await p.evaluate(() => { const e = document.activeElement; return e.tagName + ':' + (e.getAttribute('aria-label') || e.textContent || '').trim().slice(0, 25) })) } console.log(seq.join(' | '))
  const fr = await p.evaluate(() => { const e = document.activeElement; const cs = getComputedStyle(e); return cs.outlineStyle + ' ' + cs.outlineWidth + ' ' + cs.boxShadow.slice(0, 40) }); console.log('focus style', fr)
  await h.close() }
