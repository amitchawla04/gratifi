const setup = require('./h.js')
module.exports = async () => { for (const m of ['EU', 'IN', 'AE', 'SG', 'MY']) { const h = await setup(m, { tag: 'px' + m }); const { p, nav, ask, btn, last, lastText } = h
  await nav(3); const city = { EU: 'Lisbon', IN: 'Goa', AE: 'Muscat', SG: 'Bali', MY: 'Penang' }[m]
  await ask(`Flights to ${city} on 16 Oct for 1, back 19 Oct`); const a = await lastText(); await p.locator('.gr-flight').first().click(); await p.waitForTimeout(300); await btn(/Continue with/)
  const t = await lastText(); console.log(m, a.match(/pick the ([^.]*)\./)?.[1], '|', t.match(/Extra legroom [^ ]+ ?[^ ]*/)?.[0], '|', t.match(/Checked bag ([^(]*)/)?.[1])
  await ask('Book a lounge'); console.log('  lounge', (await lastText()).slice(0, 160)); await ask('A ride now'); console.log('  ride', (await lastText()).match(/Ride: Standard[^A-Z]*[^o]*/)?.[0]?.slice(0, 80)); await ask('Milk, eggs and bread'); console.log('  groc', (await lastText()).slice(60, 260))
  await ask('book a train'); console.log('  train', (await lastText()).slice(0, 300))
  await ask("I'm thinking of ending my life"); console.log('  crisis', (await lastText()).slice(0, 260))
  await h.close() } }
