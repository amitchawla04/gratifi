const P = (cat, query, args, extra) => `async (t, o, run) => { const r = await run('search_catalogue', Object.assign({ category: ${JSON.stringify(cat)}, query: ${JSON.stringify(query)} }, ${JSON.stringify(extra||{})})); const d = r && r.data; const ids = d.map(x=>x.id); await run('prepare_checkout', Object.assign({ id: ids[0] }, ${JSON.stringify(args)})); return 'Confirm with the button.' }`
module.exports = [
 { say: 'ride yesterday', plan: P('rides', 'ride', { destination: 'Heathrow', pickup_time: '2026-09-29 10:00' }) },
 { js: () => [...document.querySelectorAll('.gr-answer')].pop().innerText.replace(/\s+/g,' ').slice(-520) },
 { say: 'ride 25:00', plan: P('rides', 'ride', { destination: 'Heathrow', pickup_time: '25:00' }) },
 { js: () => [...document.querySelectorAll('.gr-answer')].pop().innerText.replace(/\s+/g,' ').slice(-520) },
 { say: 'ride 07:00 today', plan: P('rides', 'ride', { destination: 'Heathrow', pickup_time: '07:00' }) },
 { js: () => [...document.querySelectorAll('.gr-answer')].pop().innerText.replace(/\s+/g,' ').slice(-520) },
 { say: 'ride tomorrow 06:30', plan: P('rides', 'ride', { destination: 'Heathrow', pickup_time: '06:30', date: '2026-10-01' }) },
 { js: () => [...document.querySelectorAll('.gr-answer')].pop().innerText.replace(/\s+/g,' ').slice(-520) },
 { say: 'car hire 3 days', plan: P('rides', 'car hire', { quantity: 3 }) },
 { js: () => [...document.querySelectorAll('.gr-answer')].pop().innerText.replace(/\s+/g,' ').slice(-520) },
 { say: 'car hire 3 days nights', plan: P('rides', 'car hire', { nights: 3, date: '2026-10-09' }) },
 { js: () => [...document.querySelectorAll('.gr-answer')].pop().innerText.replace(/\s+/g,' ').slice(-520) },
 { say: 'train', plan: P('rides', 'train to Edinburgh', { option: '09:00', quantity: 2, date: '2026-10-09' }) },
 { js: () => [...document.querySelectorAll('.gr-answer')].pop().innerText.replace(/\s+/g,' ').slice(-520) },
]
