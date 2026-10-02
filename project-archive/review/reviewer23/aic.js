// node aic.js <market> <casesfile>  -- runs AI plan cases sequentially in one session
const H = require('./h.js')
const m = process.argv[2] || 'UK', file = process.argv[3]
const CASES = require('./' + file)
H.run(async (h) => {
  const { p, ask, log, shot, full, money, nav, sheet } = h
  await nav(3)
  let i = 0
  for (const c of CASES) {
    i++
    if (c.pre) await c.pre(h)
    await p.evaluate(`window.__plan = ${c.plan}`)
    const m0 = await money()
    await ask(c.q, c.wait || 1200)
    const r = await p.evaluate(() => JSON.stringify((window.__res || []).map(r => typeof r === 'string' ? r : ({ n: r.n, a: r.a, shown: r.r && r.r.shown_to_customer, note: r.r && r.r.note }))))
    const lm = await h.lastMsg(); const sh = await sheet(); const m1 = await money()
    log(`#${i} ${c.q}\n   tools: ${r.slice(0, 900)}\n   kinds: ${lm.kinds.join(',')} | text: ${lm.text.slice(0, 300)}\n   sheet: ${sh ? sh.replace(/\s+/g, ' ').slice(0, 300) : '-'}\n   money: ${JSON.stringify(m0)} -> ${JSON.stringify(m1)}`)
    if (c.shot) await full('c' + i)
    if (c.post) await c.post(h)
    if (await p.$('.app-sheet')) { await p.keyboard.press('Escape'); await p.waitForTimeout(200) }
  }
}, { m, ai: true, tag: 'aic-' + file.replace('.js', '') })
