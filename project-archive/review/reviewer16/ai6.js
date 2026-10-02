const setup = require('./h.js')
module.exports = async () => { const h = await setup('UK', { tag: 'ai6', fake: true }); const { p, nav } = h
  await nav(3); const plan = require('./aih.js')(h)
  const r = (n, a, txt) => plan(`async (t,o,run) => { ${[].concat(n).map((x, i) => `await run(${JSON.stringify(x)}, ${JSON.stringify([].concat(a)[i])});`).join('')} return 'Here you go.' }`, txt, { u: 600, n: 900 })
  await r(['search_catalogue', 'show_item'], [{ category: 'rides', query: 'ride', date: '2026-10-01', time: '07:00' }, { id: 'GT-1', date: '2026-10-01', time: '07:00' }], 'a ride tomorrow at 7am to heathrow')
  await r('prepare_checkout', { id: 'GT-1', date: '2026-10-01', destination: 'Heathrow Airport', option: '07:00' }, 'book it')
  await r('prepare_checkout', { id: 'DN-London-0', date: '2026-10-01', option: '19:00', quantity: 14 }, 'table for 14 tomorrow at 7pm at harrow & vine')
  await r('prepare_checkout', { id: 'DN-London-0', date: '2026-10-01', option: '19:15', quantity: 2 }, 'table 7:15')
  await r('prepare_checkout', { id: 'GT-4', option: '3', date: '2026-10-16' }, 'car hire 3 days')
  await r('prepare_checkout', { id: 'GT-4', option: '45', date: '2026-10-16' }, 'car hire 45 days')
  await h.close() }
