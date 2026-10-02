const L = require('./lib.js')
const T = async (h, tag) => { await h.last(tag); h.log(`== ${tag}:`, (await h.lastText()).replace(/\n/g,' | ').slice(0, 700)) }
module.exports = async (h) => { const { p, nav, ask, click, log, state } = h
  await nav(3); await ask('Flights to Lisbon next weekend for two'); await T(h, 'res')
  await ask('only direct'); await T(h, 'direct')
  await ask('cheaper dates?'); await T(h, 'cal'); log('btns', (await p.locator('.gr-answer').last().locator('button').allInnerTexts()).join(' / '))
  await p.locator('.gr-answer').last().locator('button').nth(2).click(); await p.waitForTimeout(500); await T(h, 'cal-pick')
  await ask('just me, one way'); await T(h, 'oneway')
  await ask('flights to Lisbon on 20 October for 3 people'); await T(h, 'date')
  await p.locator('.gr-flight').first().click(); await p.waitForTimeout(400); await T(h, 'fares3')
  await click(/Continue with/); await T(h, 'seats3'); await click('Continue', true); await T(h, 'chk3')
  await click(/^Pay /); await L.confirm(h); await T(h, 'booked3')
  await click('Add a hotel'); await T(h, 'hotel'); await p.locator('.gr-answer').last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(400); await T(h, 'hotel-detail')
  await ask('things to do there'); await T(h, 'todo'); await p.locator('.gr-answer').last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(400); await T(h, 'todo-detail')
  await click('Book a lounge').catch(e => log('no lounge chip')); await T(h, 'lounge')
  await ask('Airport ride'); await T(h, 'ride')
  await ask('Do I need a visa for Lisbon?'); await T(h, 'visa')
  await ask('show my passes'); await T(h, 'passes')
}
