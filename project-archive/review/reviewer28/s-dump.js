module.exports = async (h) => { const { p, plan, nav } = h
  await nav(3)
  for (const [c,q] of [['stays',''],['airport',''],['rides',''],['rides','car hire'],['rides','train'],['experiences',''],['dining',''],['shopping',''],['shopping','clothes'],['shopping','paracetamol'],['giftcards',''],['subs',''],['tickets',''],['tickets','cinema']]) {
    await plan(`async (turns,o,run) => { const r = await run('search_catalogue', {category:'${c}', query:'${q}'}); window.__d = r; return 'Options.' }`)
    await h.ask('show ' + c + ' ' + q)
    const d = await p.evaluate(() => JSON.stringify(window.__d && window.__d.data)); console.log('\n=== ' + c + ' ' + q, (d||'').slice(0, 1400))
  }
}
