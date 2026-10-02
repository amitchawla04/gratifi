const M = process.argv[2] || 'UK'
require('./h.js')(M, async (h) => {
  const { p, ask, click, full, confirm, nav, st, log, ans, shot } = h
  await nav(3); await p.waitForTimeout(500)
  log('MODE', await p.evaluate(() => document.querySelector('.app-mode')?.textContent))
  const plan = async (fnSrc, text) => { await p.evaluate((src) => { window.__plan = eval(src) }, fnSrc); const t = await ask(text, 1500); const r = await p.evaluate(() => JSON.stringify(window.__res).slice(0, 900)); log('   RES: ' + r); return t }
  // 1 claim guard english variants
  await plan(`async (turns,o,run)=>{ return 'Your table is booked for 8pm. Enjoy.' }`, 'book a table at harrow and vine at 8')
  await plan(`async (turns,o,run)=>{ return 'Done — your booking is confirmed and I have charged your card.' }`, 'book it')
  await plan(`async (turns,o,run)=>{ return 'تم حجز رحلتك ودفع المبلغ من بطاقتك.' }`, 'احجز الرحلة')
  await plan(`async (turns,o,run)=>{ return 'I froze your card. Your card is now frozen.' }`, 'hmm ok')
  // 2 invalid inputs
  await plan(`async (turns,o,run)=>{ const r = await run('search_catalogue',{category:'stays',city:'Lisbon'}); const id = r.data?.[0]?.id || r.data?.items?.[0]?.id; window.__sid = JSON.stringify(r.data).slice(0,300); await run('prepare_checkout',{id: 'ST-1', nights: 45}); await run('prepare_checkout',{id:'ST-1', nights: 0}); await run('prepare_checkout',{id:'ST-1', nights: 2.5}); return 'Here you go.' }`, 'hotel in lisbon for 45 nights')
  log('SID', await p.evaluate(()=>window.__sid))
  // 3 turns shape
  log('TURNS', await p.evaluate(() => JSON.stringify(window.__calls.at(-1).turns.map(t => t.role + ':' + String(t.content).slice(0, 60)))))
  await shot('ai1')
}, { name: 'ai1-' + M, ai: true, len: 400 })
