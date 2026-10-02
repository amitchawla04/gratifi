const P = (calls, text) => `async (t,o,run) => { ${calls.map(c => `await run(${JSON.stringify(c[0])}, ${JSON.stringify(c[1])});`).join(' ')} return ${JSON.stringify(text)} }`
module.exports = [
  { q: 'remind me when my points are about to expire', plan: P([['set_alert', { what: 'when my points are about to expire' }]], "Done. I'll let you know before your points expire."), shot: true },
  { q: 'let me know if flights to Lisbon get cheaper', plan: P([['set_alert', { what: 'when flights to Lisbon get cheaper' }]], "Set up: you'll get an alert when flights to Lisbon drop."), shot: true,
    post: async (h) => { await h.nav(5); await h.full('me-alerts'); await h.nav(3) } },
  { q: 'book the cheapest flight to lisbon on friday and a hotel', plan: `async (t,o,run) => { const r = await run('search_flights', {destination:'Lisbon', depart_date:'2026-10-02', travellers:1}); const id = r.data && (r.data.options||r.data)[0] && (r.data.options||r.data)[0].id; await run('choose_flight', {flight_id: id}); await run('search_catalogue', {category:'stays', city:'Lisbon', date:'2026-10-02', nights:2}); return 'Pick a fare, then a hotel.' }`, shot: true },
  { q: 'flight for 1 child alone', plan: `async (t,o,run) => { await run('search_flights', {destination:'Lisbon', depart_date:'2026-10-09', travellers:1, children:1}); return 'Here are flights.' }` },
  { q: 'flight 2 infants 1 adult', plan: `async (t,o,run) => { await run('search_flights', {destination:'Lisbon', depart_date:'2026-10-09', travellers:1, infants:2}); return 'Here are flights.' }` },
  { q: 'flight date in past', plan: `async (t,o,run) => { await run('search_flights', {destination:'Lisbon', depart_date:'2026-09-01'}); return 'Here are flights.' }` },
  { q: 'flight return before depart', plan: `async (t,o,run) => { await run('search_flights', {destination:'Lisbon', depart_date:'2026-10-09', return_date:'2026-10-05'}); return 'Here are flights.' }` },
  { q: 'flight to Atlantis', plan: `async (t,o,run) => { await run('search_flights', {destination:'Atlantis'}); return 'Here are flights.' }` },
  { q: 'flight one year out', plan: `async (t,o,run) => { await run('search_flights', {destination:'Lisbon', depart_date:'2027-12-01'}); return 'Here are flights.' }` },
]
