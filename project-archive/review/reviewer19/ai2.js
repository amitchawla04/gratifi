const M = process.argv[2] || 'UK'
require('./h.js')(M, async (h) => {
  const { p, ask, click, full, confirm, nav, st, log, ans, shot } = h
  await nav(3); await p.waitForTimeout(500)
  const plan = async (fnSrc, text) => { await p.evaluate((src) => { window.__plan = eval(src) }, fnSrc); const t = await ask(text, 1500); const r = await p.evaluate(() => JSON.stringify((window.__res||[]).map(x=>x.n? {n:x.n,a:x.a,r:{s:x.r?.shown_to_customer,note:x.r?.note}}:x))); log('   RES: ' + r.slice(0,1500)); log('   SHEET: '+ await h.sheet()); return t }
  await plan(`async (turns,o,run)=>{ await run('search_catalogue',{category:'stays',city:'Lisbon'}); await run('prepare_checkout',{id: 'ST-Lisbon-0', nights: 45}); await run('prepare_checkout',{id:'ST-Lisbon-0', nights: 0}); await run('prepare_checkout',{id:'ST-Lisbon-0', nights: 2.5}); await run('prepare_checkout',{id:'ST-Lisbon-0', nights: 3, rooms: 9}); await run('prepare_checkout',{id:'ST-Lisbon-0', nights: 3, date:'2026-09-01'}); await run('prepare_checkout',{id:'ST-Lisbon-0', nights: 3, date:'2026-10-20', option:'Penthouse'}); return 'ok' }`, 'hotel in lisbon')
  await plan(`async (turns,o,run)=>{ const r=await run('search_catalogue',{category:'giftcards'}); const id=r.data[0].id; await run('prepare_checkout',{id, option:'37', recipient:'Sam', email:'sam@example.com'}); await run('prepare_checkout',{id, option:'50', recipient:'Sam'}); await run('prepare_checkout',{id, option:'50', recipient:'Sam', email:'not-an-email'}); await run('prepare_checkout',{id, option:'50', quantity: -2, recipient:'Sam', email:'sam@example.com'}); return 'ok' }`, 'gift card')
  await plan(`async (turns,o,run)=>{ const r=await run('search_catalogue',{category:'dining', guests: 14}); const id=r.data[0].id; await run('prepare_checkout',{id, option:'19:00', quantity:14}); await run('prepare_checkout',{id, option:'19:00', quantity:13}); await run('prepare_checkout',{id, option:'03:00', quantity:2}); return 'ok' }`, 'table for 14')
  await plan(`async (turns,o,run)=>{ await run('search_flights',{destination:'Lisbon', depart_date:'2026-09-20'}); await run('search_flights',{destination:'Lisbon', depart_date:'2026-10-20', return_date:'2026-10-10'}); await run('search_flights',{destination:'Lisbon', depart_date:'2026-10-20', travellers:0}); await run('search_flights',{destination:'Lisbon', depart_date:'2026-10-20', travellers:1, children:1}); await run('search_flights',{destination:'Atlantis'}); return 'ok' }`, 'flights')
  await plan(`async (turns,o,run)=>{ await run('points_and_giving',{topic:'transfer', points: 999999, to:'Northway'}); await run('points_and_giving',{topic:'transfer', points: 5000, to:'Northway'}); return 'ok' }`, 'transfer 5000 to northway')
  await plan(`async (turns,o,run)=>{ await run('card_control',{control:'freeze', on:true}); return 'Frozen.' }`, 'freeze')
  log('frozen?', JSON.stringify((await st()).card))
  await plan(`async (turns,o,run)=>{ await run('card_control',{control:'freeze', on:false}); return 'ok' }`, 'unfreeze my card')
  log('frozen?', JSON.stringify((await st()).card))
  await plan(`async (turns,o,run)=>{ await run('card_and_account',{topic:'lower my credit limit to 500'}); return 'ok' }`, 'lower my limit to 500')
  await plan(`async (turns,o,run)=>{ await run('card_and_account',{topic:'pay 50000 off my bill'}); return 'ok' }`, 'pay 50000 off my bill')
  await plan(`async (turns,o,run)=>{ await run('card_control',{control:'gambling', on:false}); return 'ok' }`, 'lift gambling block')
  await shot('ai2')
}, { name: 'ai2-' + M, ai: true, len: 300 })
