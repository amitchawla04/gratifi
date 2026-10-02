const sf = (a, say = 'Here are flights.') => `const r = await run('search_flights', ${JSON.stringify(a)}); window.__sf = r; return ${JSON.stringify(say)}`
module.exports = [
 { q: 'kids alone', plan: sf({ destination: 'Paris', depart_date: '2026-10-16', travellers: 2, children: 2 }) },
 { q: 'infants > adults', plan: sf({ destination: 'Paris', depart_date: '2026-10-16', travellers: 1, infants: 2 }) },
 { q: 'return before', plan: sf({ destination: 'Paris', depart_date: '2026-10-16', return_date: '2026-10-12' }) },
 { q: 'past', plan: sf({ destination: 'Paris', depart_date: '2026-09-01' }) },
 { q: 'bad format', plan: sf({ destination: 'Paris', depart_date: '16/10/2026' }) },
 { q: 'unknown city', plan: sf({ destination: 'Reykjavik', depart_date: '2026-10-16' }) },
 { q: '10 travellers', plan: sf({ destination: 'Paris', depart_date: '2026-10-16', travellers: 10 }) },
 { q: 'far future', plan: sf({ destination: 'Paris', depart_date: '2027-12-16' }) },
 { q: 'evening direct NY for 2 + 1 child', plan: sf({ destination: 'New York', depart_date: '2026-10-20', return_date: '2026-10-27', travellers: 3, children: 1, time_of_day: 'evening', direct_only: true }) },
 { q: 'choose it', plan: `const d = window.__sf && window.__sf.data; const id = (d.options || d)[0].id; const r = await run('choose_flight', { flight_id: id }); return 'Pick a fare.'`, shot: 'ai-fares' },
 { q: 'data dump', plan: `return JSON.stringify(window.__sf).slice(0, 600)` },
]
