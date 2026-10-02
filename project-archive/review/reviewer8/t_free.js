const setup = require('./h.js')
const market = process.argv[2] || 'UK'
const phrases = require('./' + (process.argv[3] || 'phr_uk.js'))
;(async () => {
  const H = await setup(market, { tag: 'free-' + market, q: '&tab=chat' })
  const { p, ask, last } = H
  for (const ph of phrases) {
    if (ph === '#reset') { await p.evaluate(() => localStorage.clear()); await p.reload(); await p.waitForTimeout(400); continue }
    await ask(ph, 250)
    const r = await last()
    const extra = r.blocks && r.blocks[0] ? JSON.stringify(r.blocks[0]).slice(0, 160) : ''
    console.log(`> ${ph}\n   [${r.kinds.join(',')}] ${r.text.replace(/\n/g, ' ').slice(0, 260)}\n   ${extra}`)
  }
  await H.done()
})()
