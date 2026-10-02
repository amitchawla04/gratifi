const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch()
  for (const [m, iso, tz] of [['AE', '2026-10-01T23:30:00+04:00', 'Asia/Dubai'], ['AR', '2026-10-01T06:30:00+04:00', 'Asia/Dubai'], ['AE', '2026-10-01T12:00:00+04:00', 'Asia/Dubai'], ['UK', '2026-10-01T23:30:00+01:00', 'Europe/London'], ['SG', '2026-10-01T23:30:00+08:00', 'Asia/Singapore'], ['MY', '2026-10-01T23:30:00+08:00', 'Asia/Kuala_Lumpur'], ['IN', '2026-10-01T23:30:00+05:30', 'Asia/Kolkata'], ['EU', '2026-10-01T23:30:00+01:00', 'Europe/Dublin']]) {
    const ctx = await b.newContext({ viewport: { width: 420, height: 880 }, timezoneId: tz })
    await ctx.addInitScript(`{ const T = new Date('${iso}').getTime(), O = Date, st = O.now(); class D extends O { constructor(...a) { if (a.length) super(...a); else super(T + (O.now() - st)) } static now() { return T + (O.now() - st) } } window.Date = D }`)
    const p = await ctx.newPage()
    await p.goto(`file://${__dirname}/build/test.html?m=${m}&tab=chat`); await p.evaluate(() => localStorage.clear()); await p.reload(); await p.waitForTimeout(600)
    for (const t of [m === 'AR' ? 'أبي أموت' : 'I want to die', m === 'AR' ? 'أبوي توفى السنة اللي فاتت، أبي أحجز رحلة لمسقط لذكراه' : 'my dad died last year, book flights to ' + ({UK:'Lisbon',EU:'Rome',IN:'Goa',AE:'Muscat',SG:'Bali',MY:'Penang'})[m] + ' for his anniversary']) {
      await p.fill('.gr-ask input', t); await p.press('.gr-ask input', 'Enter'); await p.waitForTimeout(700)
      const r = await p.evaluate(() => { const s = JSON.parse(localStorage.getItem('gratifi-state-v3-' + new URLSearchParams(location.search).get('m'))); const msg = s.chat[s.chat.length - 1]; return (msg.text || '') + ' | ' + (msg.blocks || []).map(b => b.kind).join(',') + ' | ' + [...document.querySelectorAll('.gr-answer')].pop().innerText.replace(/\n/g, ' / ').slice(0, 260) })
      console.log(m, iso.slice(11, 16), '|', t.slice(0, 30), '=>', r.slice(0, 600))
    }
    await ctx.close()
  }
  await b.close()
})()
