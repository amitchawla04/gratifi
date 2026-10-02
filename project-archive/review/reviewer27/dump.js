module.exports = async (h) => { const { p, say, plan, res, nav } = h
  await nav(3)
  for (const c of ['stays','airport','rides','experiences','dining','shopping','giftcards','subs','tickets']) {
    await plan(`async (turns,o,run) => { const r = await run('search_catalogue', {category:'${c}'}); window.__d = r; return 'Here are some options.' }`)
    await h.ask('show ' + c)
    const d = await p.evaluate(() => JSON.stringify(window.__d)); console.log('\n=== ' + c, d.slice(0, 2500))
  }
}
