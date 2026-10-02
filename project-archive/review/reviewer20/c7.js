const tail = () => [...document.querySelectorAll('.gr-answer')].pop().innerText.replace(/\s+/g,' ').slice(0, 600)
module.exports = [
 { say: 'Flights to Lisbon 12 to 15 October', plan: `async (t,o,run) => { const r = await run('search_flights', { destination: 'Lisbon', depart_date: '2026-10-12', return_date: '2026-10-15', travellers: 1 }); await run('choose_flight', { flight_id: r.data.options[2].id }); return 'Pick a fare.' }` },
 { click: /^Continue with/ }, { click: 'Continue', exact: true }, { click: /^Pay / }, { click: /Pay with/, inSheet: true },
 { js: () => { const s = JSON.parse(localStorage.getItem('gratifi-state-v3-UK')); return s.bookings.map(b => [b.id, b.ref, b.title, b.status, b.total, b.extra && b.extra.fare]) } },
 { say: 'move my return to the 16th in the evening', plan: `async (t,o,run) => { const b = await run('my_bookings', {}); const id = b.data[0].id; await run('manage_booking', { booking_id: id, action: 'change date', leg: 'return' }); return 'Pick a new date.' }` },
 { js: tail },
 { say: 'cancel my flight', plan: `async (t,o,run) => { const b = await run('my_bookings', {}); await run('manage_booking', { booking_id: b.data[0].id, action: 'cancel' }); return 'I have cancelled your flight and refunded you.' }` },
 { js: tail },
 { say: 'change my seat', plan: `async (t,o,run) => { const b = await run('my_bookings', {}); await run('manage_booking', { booking_id: b.data[0].id, action: 'change seat' }); return 'Pick a seat.' }` },
 { js: tail },
 { shot: 'seatchange' },
 { say: 'show my boarding pass', plan: `async (t,o,run) => { const b = await run('my_bookings', {}); await run('manage_booking', { booking_id: b.data[0].id, action: 'show pass' }); return 'Here it is.' }` },
 { js: tail },
]
