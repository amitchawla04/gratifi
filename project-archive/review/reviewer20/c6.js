const tail = () => [...document.querySelectorAll('.gr-answer')].pop().innerText.replace(/\s+/g,' ').slice(0, 500)
module.exports = [
 { say: 'Flights to Lisbon 12 to 15 October for 2 adults and a 5 year old', plan: `async (t,o,run) => { window.__tools = o.tools.map(x=>x.name); window.__turns = t.map(x=>x.role).join(','); const r = await run('search_flights', { destination: 'Lisbon', depart_date: '2026-10-12', return_date: '2026-10-15', travellers: 3, children: 1 }); window.__fid = r.data.options[0].id; return 'Here are the flights.' }` },
 { js: () => [window.__tools.length, window.__tools.join(','), window.__turns] },
 { js: tail },
 { say: 'the first one', plan: `async (t,o,run) => { const m = t.map(x=>x.content).join(' ').match(/FL-[A-Z]+-[0-9-]+-[a-z]/); window.__hist = t.slice(1).map(x=>x.role+':'+String(x.content).slice(0,160)); await run('choose_flight', { flight_id: m ? m[0] : 'none' }); return 'Pick a fare.' }` },
 { js: () => window.__hist },
 { js: tail },
 { click: /^Continue with/ },
 { js: () => { const ins = [...document.querySelectorAll('.gr-answer:last-of-type input.app-in, .gr-answer input')]; return ins.map(i => i.placeholder + '|' + i.value + '|' + i.type) } },
 { js: tail },
]
