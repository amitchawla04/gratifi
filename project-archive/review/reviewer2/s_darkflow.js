const L = require('./lib.js')
module.exports = async (h) => { const { p, nav, ask, click, full, shot } = h
  await nav(3); await ask('Flights to Lisbon next weekend for two'); await p.locator('.gr-answer').last().locator('.gr-flight').first().click(); await p.waitForTimeout(400); await click(/Continue with/); await full('seats'); await click('Continue', true); await click(/^Pay /); await p.waitForTimeout(400); await shot('sheet'); await L.confirm(h); await full('receipt')
  await nav(4); await click('Show pass'); await full('pass')
  await nav(3); await L.buy(h, 'A hotel in Lisbon', 'stay'); await ask('Milk, eggs and bread'); await full('groc'); await ask('What do I owe?'); await full('owe'); await ask('Freeze my card'); await full('freeze'); await ask('Where did my money go?'); await full('spend')
  await ask('Transfer points to miles'); await full('transfer'); await ask('Ways to earn more'); await full('earn')
}
