module.exports = async (h) => {
  const { p, say, log, lastAnswer, setPlan, res } = h
  const T = async (plan, q) => { await setPlan(plan); await say(q); log('  A: ' + (await lastAnswer()).slice(0, 260)); log('  RES ' + (await res()).slice(0, 300)) }
  await T(`async (t,o,run)=>{ await run('groceries',{items:'milk, eggs and bread'}); return 'Added.' }`, 'milk eggs bread')
  await T(`async (t,o,run)=>{ await run('groceries',{items:'remove the bread and make the milk 3'}); return 'Updated.' }`, 'remove the bread and make the milk 3')
  await T(`async (t,o,run)=>{ await run('groceries',{items:'20 avocados'}); return 'Added.' }`, 'add 20 avocados')
  await T(`async (t,o,run)=>{ await run('groceries',{items:'milk x 50'}); return 'Added.' }`, 'milk x50')
  await T(`async (t,o,run)=>{ await run('choose_flight',{flight_id:'FL-XXX'}); return 'ok' }`, 'bad flight id')
  await T(`async (t,o,run)=>{ await run('prepare_checkout',{id:'FL-LIS-2026-10-16-1-o'}); return 'ok' }`, 'checkout flight id')
  await T(`async (t,o,run)=>{ await run('show_item',{id:'ST-Lisbon-0',nights:0}); return 'ok' }`, 'nights 0')
  await T(`async (t,o,run)=>{ await run('search_catalogue',{category:'stays',city:'Lisbon',nights:31,guests:2}); return 'ok' }`, 'stays 31 nights')
  await T(`async (t,o,run)=>{ await run('search_catalogue',{category:'dining',city:'London',guests:20,time:'19:00'}); return 'ok' }`, 'dining 20')
  await T(`async (t,o,run)=>{ await run('travel_essentials',{topic:'foreign transaction fee'}); return 'ok' }`, 'fx fee')
  await T(`async (t,o,run)=>{ await run('card_and_account',{topic:'foreign transaction fee'}); return 'ok' }`, 'fx fee 2')
}
