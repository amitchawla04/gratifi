const setup = require('./h.js')
const phrases = require('./' + process.argv[2])
;(async () => {
  const H = await setup('AR', { tag: 'freear', q: '&tab=chat' })
  const { p, ask, last } = H
  for (const ph of phrases) { await ask(ph, 350); const t = await p.locator('.gr-answer').last().innerText().catch(() => ''); const r = await last(); console.log(`> ${ph} [${r.kinds.join(',')}]\n   ${t.replace(/\n+/g, ' / ').slice(0, 300)}`) }
  await H.done()
})()
