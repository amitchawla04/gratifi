const H = require('./h.js')
const m = process.argv[2] || 'UK'
H.run(async (h) => {
  const { p, ask, log, shot, full, money, nav } = h
  const setPlan = async (fnSrc) => p.evaluate(`window.__plan = ${fnSrc}`)
  const res = async () => p.evaluate(() => JSON.stringify(window.__res).slice(0, 1500))
  await nav(3)
  log('mode', await p.evaluate(() => document.querySelector('.app-mode')?.textContent))
  // 1. search catalogue for stays and log data shape
  await setPlan(`async (t,o,run) => { await run('search_catalogue', {category:'stays', city:'Lisbon'}); return 'Here are some hotels.' }`)
  await ask('hotels in lisbon', 1200); log('S1', await res())
  await setPlan(`async (t,o,run) => { await run('search_catalogue', {category:'dining'}); await run('search_catalogue', {category:'shopping', query:'jacket'}); await run('search_catalogue', {category:'giftcards'}); await run('search_catalogue', {category:'rides'}); await run('search_catalogue', {category:'tickets'}); await run('search_catalogue', {category:'airport'}); await run('search_catalogue', {category:'subs'}); await run('search_catalogue', {category:'experiences'}); return 'ok' }`)
  await ask('show me stuff', 1500); log('S2', await p.evaluate(() => JSON.stringify(window.__res.map(r => ({ n: r.n, a: r.a, d: r.r && r.r.data })))).then(s => s.slice(0, 4000)))
}, { m, ai: true, tag: 'ai1' })
