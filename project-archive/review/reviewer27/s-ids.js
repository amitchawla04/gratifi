module.exports = async (h) => { const { p, say, plan, res, nav } = h
  await nav(3)
  for (const c of ['stays','airport','rides','experiences','dining','shopping','giftcards','subs','tickets']) {
    await plan(`async (turns,o,run) => { await run('search_catalogue', {category:'${c}'}); return 'Here are some options.' }`)
    await h.ask('show ' + c)
    const r = await res(); console.log(c, JSON.stringify(r.map(x => x.r ? {note: x.r.note, data: x.r.data} : x)).slice(0, 1500))
  }
}
