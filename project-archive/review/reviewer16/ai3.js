const setup = require('./h.js')
module.exports = async () => { const h = await setup('UK', { tag: 'ai3', fake: true }); const { p, shot, nav, ask, btn, confirm, st, lastText, last } = h
  await nav(3); const plan = require('./aih.js')(h)
  await plan(`async (t,o,run) => { await run('search_flights', {destination:'Lisbon', depart_date:'2026-10-16', return_date:'2026-10-20', travellers:3, children:1}); return 'Here are flights.' }`, 'flights to lisbon 16-20 oct, me, wife and our 6 year old')
  await plan(`async (t,o,run) => { window.__t = t; await run('choose_flight', {flight_id:'FL-LIS-2026-10-16-1-o'}); return 'Pick a fare.' }`, 'the 07:25 please')
  console.log('last ctx', await p.evaluate(() => window.__t[0].content.split('Last search:')[1]))
  console.log('hist', await p.evaluate(() => JSON.stringify(window.__t.slice(1).map(x => String(x.content).slice(0, 200)))))
  await shot('choose')
  await h.close() }
