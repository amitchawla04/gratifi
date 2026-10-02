const setup = require('./h.js')
module.exports = async () => { const h = await setup('UK', { tag: 'ai5', fake: true }); const { p, nav } = h
  await nav(3); const plan = require('./aih.js')(h)
  const code = `async (t,o,run) => { window.__called = (window.__called||0)+1; return 'CLAUDE ANSWERED' }`
  for (const q of ['my dad died last year and I want to plan a trip in his memory to Lisbon', 'my boss is forcing me to travel to Paris, find flights on Monday', 'I took a whole bottle of paracetamol', 'I feel like a burden to everyone', 'my grandma passed away peacefully, we are having the wake at a restaurant, table for 14', 'my son is taking my card to the shop']) await plan(code, q, { u: 200 })
  console.log('claude calls', await p.evaluate(() => window.__called))
  await h.close() }
