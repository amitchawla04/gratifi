module.exports = async (h) => { const { p, plan, nav, full, click, confirm, state, res } = h
  await nav(3)
  await plan(`async (turns,o,run) => { const r = await run('search_flights', {destination:'Lisbon', depart_date:'2026-10-16', return_date:'2026-10-20', travellers:3, children:1, infants:1}); window.__r=r; return 'Here are flights to Lisbon.' }`)
  await h.ask('flights to lisbon 16 to 20 oct, 2 adults, a 7 year old and a baby', 1200)
  const r = await p.evaluate(() => window.__r); console.log('SEARCH', JSON.stringify(r).slice(0, 600))
  const fid = r.data.options[0].id
  await plan(`async (turns,o,run) => { const r = await run('choose_flight', {flight_id:'${fid}'}); window.__r=r; return 'Pick a fare.' }`)
  await h.ask('the first one', 1000); console.log('CHOOSE', JSON.stringify(await p.evaluate(() => window.__r)).slice(0, 400))
  await full('fares')
  await click(/Continue with/); await full('seats')
  console.log('SEATCARD', (await h.last()).slice(0, 1500))
}
module.exports.more = true
