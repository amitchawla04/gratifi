const L = require('./lib.js')
const T = async (h, tag) => { await h.last(tag); h.log(`== ${tag}:`, (await h.lastText()).replace(/\n/g,' | ').slice(0, 900)) }
module.exports = async (h) => { const { p, nav, ask, click, log, state } = h
  const sw = () => p.locator('.app-demo [role=switch]')
  await nav(5); await sw().nth(0).click(); await nav(3)
  await ask('Leather trainers'); await p.locator('.gr-answer').last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(400); await p.locator('.gr-answer').last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(400)
  await click(/^Pay /); await L.confirm(h); await T(h, 'rise'); log('sim after rise', (await state()).sim)
  await nav(5); log('toggles', await sw().evaluateAll(e => e.map(x => x.getAttribute('aria-checked'))))
  await sw().nth(1).click(); log('sim', (await state()).sim); await nav(3)
  await ask('A hotel in Lisbon'); await p.locator('.gr-answer').last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(400); await p.locator('.gr-answer').last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(400)
  const s0 = await state(); await click(/^Pay /); await L.confirm(h); await T(h, 'supplier'); const s1 = await state(); log('bal', s0.balance, s1.balance, s1.bookings.length); log('btns', await p.locator('.gr-answer').last().locator('button').allInnerTexts())
  await click('Try again').catch(e => log('no try again')); await p.waitForTimeout(400); if (await p.$('.app-sheet')) await L.confirm(h); await T(h, 'retry')
}
