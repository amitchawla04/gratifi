module.exports = async (h) => {
  const { setPlan, say, res, log, sheet, p, st, lastAnswer, click, confirm, full } = h
  const d = (n) => { const x = new Date(); x.setDate(x.getDate() + n); return x.toISOString().slice(0, 10) }
  const T = async (plan, q) => { await setPlan(plan); await say(q); log('  ANSWER: ' + (await lastAnswer()).slice(0, 700)) }
  await T(`async (t,o,run)=>{ await run('prepare_checkout',{id:'ET-4',quantity:3,option:'20:50'}); return 'Here it is.' }`, 'cinema for 3 at 20:50')
  await full('cinema3')
  await T(`async (t,o,run)=>{ await run('prepare_checkout',{id:'AP-1',quantity:4}); return 'Here it is.' }`, 'lounge for 4')
  await full('lounge4')
  await click(/^Pay /); log('  SHEET: ' + await sheet()); await confirm(); log('  AFTER: ' + (await lastAnswer()).slice(0, 600))
  await full('lounge4-done')
  await T(`async (t,o,run)=>{ await run('prepare_checkout',{id:'GT-4',days:3}); return 'Here it is.' }`, 'car for 3 days')
  await T(`async (t,o,run)=>{ await run('prepare_checkout',{id:'GT-6',quantity:2,option:'07:30',date:'${d(0)}'}); return 'Here it is.' }`, 'train at 07:30 today for 2')
  await T(`async (t,o,run)=>{ await run('prepare_checkout',{id:'ST-Lisbon-0',nights:3,date:'${d(9)}',option:'Suite',quantity:5}); return 'Here it is.' }`, 'suite in lisbon for 5 people')
  await T(`async (t,o,run)=>{ await run('prepare_checkout',{id:'ST-Lisbon-0',nights:3,date:'${d(9)}',option:'Double',quantity:5,rooms:1}); return 'Here it is.' }`, 'double for 5 people 1 room')
  await T(`async (t,o,run)=>{ await run('prepare_checkout',{id:'SB-1',option:'Premium 4K'}); return 'Here it is.' }`, 'screenly premium')
  await T(`async (t,o,run)=>{ await run('prepare_checkout',{id:'SB-2'}); return 'Here it is.' }`, 'tunewave')
  await T(`async (t,o,run)=>{ await run('prepare_checkout',{id:'ET-1',quantity:2,option:'Seated, lower'}); return 'Here it is.' }`, 'arlo grey lower x2')
  await T(`async (t,o,run)=>{ await run('prepare_checkout',{id:'EX-Lisbon-0',quantity:2,date:'${d(3)}'}); return 'Here it is.' }`, 'lisbon experience')
  await T(`async (t,o,run)=>{ await run('search_flights',{destination:'Lisbon',depart_date:'${d(10)}',return_date:'${d(8)}',travellers:2}); return 'Here.' }`, 'lisbon return before out')
  await T(`async (t,o,run)=>{ await run('search_flights',{destination:'Lisbon',depart_date:'${d(10)}',travellers:1,children:1}); return 'Here.' }`, 'child counted in travellers alone?')
  await T(`async (t,o,run)=>{ await run('search_flights',{destination:'Lisbon',depart_date:'${d(10)}',travellers:1,children:1,infants:0}); return 'Here.' }`, 'one child only')
  await T(`async (t,o,run)=>{ await run('search_flights',{destination:'Lisbon',depart_date:'${d(10)}',travellers:1,infants:2}); return 'Here.' }`, '1 adult 2 infants')
  await T(`async (t,o,run)=>{ await run('search_flights',{destination:'Atlantis',depart_date:'${d(10)}'}); return 'Here.' }`, 'flights to atlantis')
  await T(`async (t,o,run)=>{ await run('search_flights',{destination:'Lisbon',depart_date:'2027-12-01'}); return 'Here.' }`, 'lisbon dec 2027')
  await T(`async (t,o,run)=>{ await run('search_flights',{destination:'Lisbon',depart_date:'${d(10)}',travellers:12}); return 'Here.' }`, 'lisbon for 12')
}
