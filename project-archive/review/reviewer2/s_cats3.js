const L = require('./lib.js')
module.exports = async (h) => { await h.nav(3)
  await L.buy(h, 'A gift card for a friend', 'gift', { pre: async () => { const i = h.p.locator('.gr-answer').last().locator('input'); h.log('inputs', await i.count()); await i.nth(0).fill('Sam').catch(()=>{}); await i.nth(1).fill('sam@example.com').catch(()=>{}) } })
  await L.buy(h, 'Which subscriptions are included?', 'subinc')
  await L.buy(h, 'Start a streaming subscription', 'subpaid')
  await L.buy(h, 'eSIM for data abroad', 'esim')
  await L.buy(h, 'Travel insurance', 'ins')
}
