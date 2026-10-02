module.exports = async (h) => { const { p, plan, nav, full } = h
  await nav(3)
  const txt = async () => (await p.locator('.gr-answer').last().innerText().catch(() => '')).replace(/\n+/g, ' | ')
  const go = async (msg, resp, body) => { await p.evaluate(r => { window.__safetyResp = r; window.__safetyDelay = 300 }, resp); await plan(`async (turns,o,run) => { ${body} }`); await h.ask(msg, 1800); console.log(`\n[${msg}] => ${(await txt()).slice(0, 500)}`) }
  await go('أخذت حبوب وايد', {risk:'overdose', who:'self'}, `return 'آسف لسماع ذلك.'`)
  await full('ar-od')
  await go('واحد عند الباب يقول إنه من البنك ويبي البطاقة', {risk:'coercion', who:'self'}, `await run('talk_to_person',{reason:'man at door says he is from the bank and wants the card', fraud:true}); return 'لا تسلّم البطاقة.'`)
  await full('ar-door')
  await go('ذكرني لما تنزل أسعار مسقط', null, `await run('set_alert',{what:'when prices to Muscat drop'}); return 'سأذكرك عندما تنخفض الأسعار.'`)
  await go('أبغى تاكسي للمطار بكرة الساعة 7 الصبح', null, `await run('prepare_checkout',{id:'GT-1', destination:'airport', date:'2026-10-01', pickup_time:'07:00'}); return 'أكد بالزر.'`)
  await full('ar-ride')
}
