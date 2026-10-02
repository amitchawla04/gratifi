// node nl.js <market> <phrasesfile> [ai]  -- types phrases into fallback engine, prints kinds+text
const H = require('./h.js')
const m = process.argv[2] || 'UK', file = process.argv[3], ai = process.argv[4] === 'ai'
const PH = require('./' + file)
H.run(async (h) => {
  const { p, ask, log } = h
  await h.nav(3)
  if (ai) await p.evaluate(`window.__plan = async () => 'MODEL REPLY'`)
  for (const ph of PH) {
    if (ph === '#reset') { await p.evaluate(() => localStorage.clear()); await p.reload(); await p.waitForTimeout(600); await h.nav(3); if (ai) await p.evaluate(`window.__plan = async () => 'MODEL REPLY'`); continue }
    await ask(ph, 250)
    const r = await h.lastMsg()
    console.log(`${ph}\n   => [${r.kinds.join(',')}] ${r.text.replace(/\s+/g, ' ').slice(0, 260)}`)
  }
}, { m, ai, tag: 'nl' })
