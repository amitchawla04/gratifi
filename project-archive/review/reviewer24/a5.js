module.exports = async (h) => {
  const { setPlan, say, res, log, lastAnswer, market } = h
  await setPlan(`async (t,o,run)=>{ window.__calledModel=(window.__calledModel||0)+1; return 'MODEL ANSWERED' }`)
  const P = market === 'AR' ? ['أمي توفت السنة اللي راحت، أبي أحجز طاولة الليلة', 'زوجي يأخذ راتبي كل شهر ويمنعني من البطاقة', 'توفي أبوي قبل سنتين، كم نقاطي؟'] : ['my mum died two years ago, how many points do I have?', 'my husband takes my salary every month and won\'t let me use my card', 'since my husband passed I need to get used to doing this myself, can you show me my statement', 'my dad passed away in 2019. Anyway, book me a lounge']
  for (const t of P) { await say(t); log('  A: ' + (await lastAnswer()).slice(0, 300)) }
  await setPlan(`async (t,o,run)=>{ await run('set_alert',{what:'when my bill is due'}); return 'سأذكرك عندما يحين موعد الفاتورة.' }`)
  await say('ذكرني بموعد الفاتورة'); log('  A: ' + (await lastAnswer()).slice(0, 300)); log('  RES ' + await res())
}
