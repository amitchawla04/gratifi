module.exports = async (h) => { const { p, plan, nav } = h
  await nav(3)
  const C = [
    ['kid alone', {destination:'Lisbon', depart_date:'2026-10-16', travellers:1, children:1}],
    ['past', {destination:'Lisbon', depart_date:'2026-09-01'}],
    ['ret before dep', {destination:'Lisbon', depart_date:'2026-10-16', return_date:'2026-10-10'}],
    ['bad fmt', {destination:'Lisbon', depart_date:'16/10/2026'}],
    ['infants>adults', {destination:'Lisbon', depart_date:'2026-10-16', travellers:1, infants:2}],
    ['unknown city', {destination:'Tokyo', depart_date:'2026-10-16'}],
    ['10 pax', {destination:'Lisbon', depart_date:'2026-10-16', travellers:12}],
    ['evening', {destination:'Paris', depart_date:'2026-10-16', time_of_day:'evening', direct_only:true}],
    ['far future', {destination:'Paris', depart_date:'2027-12-16'}],
  ]
  for (const [l, a] of C) { await plan(`async (turns,o,run) => { const r = await run('search_flights', ${JSON.stringify(a)}); window.__d = r; return '' }`); await h.ask('f ' + l, 900); const d = await p.evaluate(() => JSON.stringify(window.__d && { s: window.__d.shown_to_customer, n: window.__d.note })); console.log(`[${l}] ${d.slice(0, 300)}`) }
}
