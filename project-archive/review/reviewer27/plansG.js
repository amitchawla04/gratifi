const P = (s) => `async (turns,o,run) => { ${s} }`
module.exports = [
 { q: 'Flights to Lisbon next Friday for two, back Sunday', plan: P(`await run('search_flights', {destination:'Lisbon', depart_date:'2026-10-09', return_date:'2026-10-11', travellers:2}); return 'The 07:25 Coastline is the best fit at £134 each way; tap a flight to see fares.'`), shot: 'ai-flights' },
 { q: 'the first one', plan: P(`const r = await run('choose_flight', {flight_id: turns.map(t=>t.content).join(' ').match(/FL-[A-Za-z0-9-]+/)?.[0] || 'x'}); return 'Pick a fare below.'`), shot: 'ai-fares' },
]
