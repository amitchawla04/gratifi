module.exports = async (h) => { const { p, nav, ask, log } = h
  const run = async (tag) => log(tag, JSON.stringify(await p.evaluate(() => {
    const parse = c => { const m = c.match(/[\d.]+/g); return m ? m.map(Number) : [0,0,0,1] }
    const lum = ([r,g,b]) => { const f = v => { v/=255; return v <= 0.03928 ? v/12.92 : Math.pow((v+0.055)/1.055, 2.4) }; return 0.2126*f(r)+0.7152*f(g)+0.0722*f(b) }
    const bgOf = e => { while (e) { const c = parse(getComputedStyle(e).backgroundColor); if (c.length < 4 || c[3] > 0.5) { if (!(c[0]===0&&c[1]===0&&c[2]===0&&c.length>=4&&c[3]===0)) return c } e = e.parentElement } return [255,255,255] }
    const out = {}; const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let n
    while (n = w.nextNode()) { const t = n.nodeValue.trim(); if (!t) continue; const e = n.parentElement; const r = e.getBoundingClientRect(); if (!r.width) continue; const cs = getComputedStyle(e); const fg = parse(cs.color), bg = bgOf(e); const L1 = lum(fg), L2 = lum(bg); const cr = (Math.max(L1,L2)+0.05)/(Math.min(L1,L2)+0.05); const size = parseFloat(cs.fontSize), bold = +cs.fontWeight >= 700; const need = (size >= 24 || (size >= 18.66 && bold)) ? 3 : 4.5; if (cr < need) out[t.slice(0,40)] = cr.toFixed(2) + ' ' + cs.color + ' on ' + bg.join(',') + ' ' + size + 'px' }
    return out })))
  await run('home'); await nav(3); await ask('Flights to Lisbon next weekend for two'); await run('chat'); await nav(5); await run('me')
}
