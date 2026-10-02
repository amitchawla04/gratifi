module.exports = async (h) => {
  const { setPlan, say, res, log, lastAnswer, click, confirm, st, p, sheet, full } = h
  const S = async (l) => { const s = await st(); log(`  [${l}] pts=${s.balance} card.bal=${s.card.balance} bookings=${JSON.stringify(s.bookings.map(b => [b.id, b.title.slice(0, 22), b.status]))}`) }
  await setPlan(`async (t,o,run)=>{ await run('prepare_checkout',{id:'SH-1'}); return 'Here is the checkout. Confirm with the button.' }`)
  await say('buy the hush headphones'); await click(/^Pay /); await confirm(); await S('bought')
  const id = (await st()).bookings[0].id
  await setPlan(`async (t,o,run)=>{ await run('manage_booking',{booking_id:'${id}',action:'cancel'}); return "I've cancelled your headphones and refunded you." }`)
  await say('cancel my headphones'); log('  A: ' + (await lastAnswer()).slice(0, 400)); await S('after AI cancel')
  await setPlan(`async (t,o,run)=>{ await run('manage_booking',{booking_id:'${id}',action:'return'}); return "Return started." }`)
  await say('return them'); log('  A: ' + (await lastAnswer()).slice(0, 400)); log('  RES ' + (await res()).slice(0, 400)); await S('after AI return')
  // flight via tools
  await setPlan(`async (t,o,run)=>{ const r = await run('search_flights',{destination:'Lisbon',depart_date:'2026-10-16',return_date:'2026-10-18',travellers:2}); window.__fl = r; return 'Here are flights.' }`)
  await say('flights to lisbon 16 to 18 oct for 2'); const fl = await p.evaluate(() => JSON.stringify(window.__fl).slice(0, 600)); log('  FL ' + fl)
  const fid = await p.evaluate(() => (window.__fl.data && window.__fl.data.options && window.__fl.data.options[0].id) || '')
  await setPlan(`async (t,o,run)=>{ await run('choose_flight',{flight_id:'${fid}'}); return 'Pick a fare.' }`)
  await say('the first one'); log('  A: ' + (await lastAnswer()).slice(0, 500))
  await full('ai-fares')
  // manage change date via AI on bogus id
  await setPlan(`async (t,o,run)=>{ await run('manage_booking',{booking_id:'GR-00000',action:'cancel'}); return 'ok' }`)
  await say('cancel booking GR-00000'); log('  RES ' + (await res()).slice(0, 300))
  await setPlan(`async (t,o,run)=>{ await run('my_bookings',{}); return 'Here is what you have.' }`)
  await say('what have I booked'); log('  A: ' + (await lastAnswer()).slice(0, 300))
  await setPlan(`async (t,o,run)=>{ await run('card_and_account',{topic:'pay my bill in full'}); return 'Here you go.' }`)
  await say('pay my bill'); log('  A: ' + (await lastAnswer()).slice(0, 300)); log('  sheet ' + await sheet()); await S('after pay bill ask')
  await setPlan(`async (t,o,run)=>{ await run('card_and_account',{topic:'lower my limit to 2000'}); return 'Here you go.' }`)
  await say('lower my limit to 2000'); log('  A: ' + (await lastAnswer()).slice(0, 300)); log('  sheet ' + await sheet())
  await setPlan(`async (t,o,run)=>{ await run('card_and_account',{topic:'lower my limit to 20000'}); return 'Here you go.' }`)
  await say('lower my limit to 20000'); log('  A: ' + (await lastAnswer()).slice(0, 300)); log('  sheet ' + await sheet())
  await setPlan(`async (t,o,run)=>{ await run('card_and_account',{topic:'lower my limit to 500'}); return 'Here you go.' }`)
  await say('lower my limit to 500'); log('  A: ' + (await lastAnswer()).slice(0, 300)); log('  sheet ' + await sheet())
}
