const L = require('./lib.js')
module.exports = async (h) => { await h.nav(3)
  await L.buy(h, 'Things to do in Lisbon', 'exp')
  await L.buy(h, 'A table tonight for two', 'dine', { pre: async () => { await h.p.locator('.gr-slot').nth(2).click().catch(()=>{}) } })
  await L.buy(h, 'Noise-cancelling headphones', 'shop')
  await L.buy(h, 'Earn extra points shopping', 'aff')
  await L.buy(h, 'Concerts this month', 'tix')
}
