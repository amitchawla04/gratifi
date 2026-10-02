const P = (s) => `async (turns,o,run) => { ${s} }`
module.exports = [
 { q: 'flights to Paris 12 Nov for my kids aged 8 and 10', plan: P(`await run('search_flights', {destination:'Paris', depart_date:'2026-11-12', travellers:2, children:2}); return 'Here.'`) },
 { q: 'flights to Paris 12 Nov, just my 8 year old', plan: P(`await run('search_flights', {destination:'Paris', depart_date:'2026-11-12', travellers:1, children:1}); return 'Here.'`) },
 { q: 'flights to Paris 12 Nov for 1 adult and 3 infants', plan: P(`await run('search_flights', {destination:'Paris', depart_date:'2026-11-12', travellers:1, infants:3}); return 'Here.'`) },
 { q: 'flights to Paris 12 Nov back 10 Nov', plan: P(`await run('search_flights', {destination:'Paris', depart_date:'2026-11-12', return_date:'2026-11-10', travellers:1}); return 'Here.'`) },
 { q: 'flights to Paris yesterday', plan: P(`await run('search_flights', {destination:'Paris', depart_date:'2026-09-29', travellers:1}); return 'Here.'`) },
 { q: 'flights to Paris in 2 years', plan: P(`await run('search_flights', {destination:'Paris', depart_date:'2028-09-29', travellers:1}); return 'Here.'`) },
 { q: 'flights to Tokyo', plan: P(`await run('search_flights', {destination:'Tokyo', travellers:1}); return 'Here.'`) },
 { q: 'flights 12 travellers', plan: P(`await run('search_flights', {destination:'Paris', depart_date:'2026-11-12', travellers:12}); return 'Here.'`) },
 { q: 'choose fake flight', plan: P(`await run('choose_flight', {flight_id:'FL-XXX'}); return 'Here.'`) },
]
