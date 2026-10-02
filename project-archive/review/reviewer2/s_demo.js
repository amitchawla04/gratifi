const L = require('./lib.js')
const T = async (h, tag) => { await h.last(tag); h.log(`== ${tag}:`, (await h.lastText()).replace(/\n/g,' | ').slice(0, 900)) }
const tog = async (h, i) => { await h.nav(5); await h.p.locator('.app-demo [role=switch]').nth(i).click(); await h.p.waitForTimeout(300) }
module.exports = async (h) => { const { p, nav, ask, click, full, last, shot, summ, lastText, log } = h
  // demo buttons without context
  await nav(5); await click('Cancel my next flight'); await T(h, 'noflight'); await nav(5); await click('Delay my order'); await T(h, 'noorder')
  await nav(5); await click(/Points come in/); await summ('points in'); await click('A card payment'); await p.waitForTimeout(400); await shot('cardpay'); await summ('card pay')
  // price rise
  await tog(h, 0); await nav(3)
  await ask('Noise-cancelling headphones'); await p.locator('.gr-answer').last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(400); await p.locator('.gr-answer').last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(400)
  await T(h, 'rise-checkout'); await click(/^Pay /); await p.waitForTimeout(400); if (await p.$('.app-sheet')) { log('!! sheet opened on price rise'); await L.confirm(h) } await T(h, 'rise'); await summ('after rise')
  log('btns', await p.locator('.gr-answer').last().locator('button').allInnerTexts())
  await click(/^Continue at/).catch(e=>log('no continue at')); await T(h, 'rise2'); await click(/^Pay /).catch(e=>log('no pay')); await p.waitForTimeout(300); if (await p.$('.app-sheet')) await L.confirm(h); await T(h, 'rise3'); await summ('after rise pay')
  await tog(h, 0)
  // supplier down
  await tog(h, 1); await nav(3); await ask('A hotel in Lisbon'); await p.locator('.gr-answer').last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(400); await p.locator('.gr-answer').last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(400)
  const s0 = await h.state(); await click(/^Pay /); await p.waitForTimeout(300); if (await p.$('.app-sheet')) await L.confirm(h); await T(h, 'supplier'); const s1 = await h.state(); log('supplier balance', s0.balance, s1.balance, 'card', s0.card.balance, s1.card.balance); log('btns', await p.locator('.gr-answer').last().locator('button').allInnerTexts())
  await tog(h, 1)
  // decline
  await tog(h, 2); await nav(3); await ask('Leather trainers'); await p.locator('.gr-answer').last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(400); await p.locator('.gr-answer').last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(400)
  await p.getByText('Card', { exact: true }).last().click(); await p.waitForTimeout(200); await click(/^Pay /); await L.confirm(h); await T(h, 'declined'); log('btns', await p.locator('.gr-answer').last().locator('button').allInnerTexts()); await summ('declined')
  await tog(h, 2)
  // flight + cancel next flight disruption
  await nav(3); await ask('Flights to Paris next weekend for two'); await p.locator('.gr-flight').first().click(); await p.waitForTimeout(400); await click(/Continue with/); await click('Continue', true); await p.getByText('Card', { exact: true }).last().click(); await click(/^Pay /); await L.confirm(h); await summ('paris booked')
  await nav(5); await click('Cancel my next flight'); await T(h, 'disruption'); log('btns', await p.locator('.gr-answer').last().locator('button').allInnerTexts())
  await click(/Refund|money back/i).catch(e => log('no refund btn')); await p.waitForTimeout(400); if (await p.$('.app-sheet')) await L.confirm(h); await T(h, 'disr-refund'); await summ('after disruption refund')
  await ask('check compensation'); await T(h, 'comp')
  // order delay
  await ask('Milk, eggs and bread'); await click('Checkout'); await click(/^Pay /); await L.confirm(h); await nav(5); await click('Delay my order'); await T(h, 'late'); await click('Cancel for a full refund').catch(e=>log('no cancel refund')); await p.waitForTimeout(300); if (await p.$('.app-sheet')) await L.confirm(h); await T(h, 'late-refund'); await summ('after late refund')
  // fraud
  await nav(5); await click('Suspicious payment'); await T(h, 'fraud'); log('btns', await p.locator('.gr-answer').last().locator('button').allInnerTexts())
  await nav(5); await full('me-frozen')
  await nav(3); await ask('Leather trainers'); await p.locator('.gr-answer').last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(400); await p.locator('.gr-answer').last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(400); await p.getByText('Card', { exact: true }).last().click(); await click(/^Pay /); await p.waitForTimeout(300); if (await p.$('.app-sheet')) await L.confirm(h); await T(h, 'frozen-pay')
  await click('It was me').catch(e=>log('no it was me')); await p.waitForTimeout(300); if (await p.$('.app-sheet')) await L.confirm(h); await T(h, 'itwasme'); log('frozen?', (await h.state()).card.frozen)
  // reset
  await nav(5); await click('Reset demo'); await click('Yes, reset'); await summ('reset'); await nav(4); await full('wallet-reset'); await nav(3); await full('chat-reset')
}
