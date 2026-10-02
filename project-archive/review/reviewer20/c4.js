const P = (cat, query, args, extra) => `async (t, o, run) => { const r = await run('search_catalogue', Object.assign({ category: ${JSON.stringify(cat)}, query: ${JSON.stringify(query)} }, ${JSON.stringify(extra||{})})); const d = r && r.data; const ids = d.map(x=>x.id); await run('prepare_checkout', Object.assign({ id: ids[0] }, ${JSON.stringify(args)})); return 'Confirm with the button.' }`
const tail = () => [...document.querySelectorAll('.gr-answer')].pop().innerText.replace(/\s+/g,' ').slice(-330)
module.exports = [
 { say: 'ride tomorrow 06:30 in pickup', plan: P('rides', 'ride', { destination: 'Heathrow', pickup_time: '2026-10-01 06:30' }) },
 { js: tail },
 { say: 'ride tomorrow 06:30 iso T', plan: P('rides', 'ride', { destination: 'Heathrow', pickup_time: '2026-10-01T06:30' }) },
 { js: tail },
 { click: /^Pay / }, { click: /Face ID|Confirm/, inSheet: true },
 { js: () => { const s = JSON.parse(localStorage.getItem('gratifi-state-v3-UK')); return s.bookings.map(b => [b.title, b.when, b.extra]) } },
 { say: 'car hire 3 days', plan: P('rides', 'car hire', { quantity: 3, date: '2026-10-09' }) },
 { js: tail },
 { click: /^Pay / }, { click: /Face ID|Confirm/, inSheet: true },
 { js: () => { const s = JSON.parse(localStorage.getItem('gratifi-state-v3-UK')); return s.bookings.map(b => [b.title, b.when, b.sub, b.qty, b.total]) } },
 { say: 'Hire a car for 3 days from 9 October' },
 { js: tail },
 { say: 'Book a ride to Heathrow tomorrow at 6:30am' },
 { js: tail },
]
