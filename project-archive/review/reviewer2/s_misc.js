const L = require('./lib.js')
const T = async (h, tag) => { await h.last(tag); h.log(`== ${tag}:`, (await h.lastText()).replace(/\n/g,' | ').slice(0, 600)) }
module.exports = async (h) => { const { p, nav, ask, click, log, full } = h
  const S = async (f) => { try { await f() } catch (e) { log('!! step failed', e.message.split('\n')[0]) } }
  await nav(3)
  await S(async () => { await ask('Which subscriptions are included?'); await p.locator('.gr-answer').last().locator('.gr-itemrow').nth(1).click(); await p.waitForTimeout(300); await p.locator('.gr-answer').last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(300); await click('Turn it on'); await p.waitForTimeout(300); if (await p.$('.app-sheet')) await L.confirm(h); await T(h, 'tune-on') })
  await S(async () => { await ask('A ride now'); await p.locator('.gr-answer').last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(300); await p.locator('.gr-answer').last().getByText('Heathrow Airport').click(); await p.waitForTimeout(300); await T(h, 'ride-dest'); await p.locator('.gr-answer').last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(300); await T(h, 'ride-chk'); await click(/^Pay /); await L.confirm(h); await T(h, 'ride-done') })
  await S(async () => { await ask('cancel my ride'); await T(h, 'ride-cancel') })
  await S(async () => { await ask('Flights to Paris next weekend'); await p.locator('.gr-answer').last().locator('.gr-flight').first().click(); await p.waitForTimeout(300); await p.locator('.gr-answer').last().getByText('Light', { exact: true }).first().click(); await p.waitForTimeout(200); await click(/Continue with/); await T(h, 'light-seats'); await click('Continue', true); await click(/^Pay /); await L.confirm(h); await T(h, 'light-booked'); await ask('change my flight'); await T(h, 'light-change'); await ask('cancel my flight'); await T(h, 'light-cancel'); log('btns', await p.locator('.gr-answer').last().locator('button').allInnerTexts()) })
  await S(async () => { await L.buy(h, 'Concerts this month', 'tix'); await ask('cancel my tickets'); await T(h, 'tix-cancel'); log('btns', await p.locator('.gr-answer').last().locator('button').allInnerTexts()) })
  await S(async () => { await L.buy(h, 'A table tonight for two', 'tbl'); await ask('cancel my table'); await T(h, 'tbl-cancel'); await click('Yes, cancel'); await T(h, 'tbl-cancelled') })
  await S(async () => { await ask('cancel it'); await T(h, 'cancel-it') })
  await S(async () => { await L.buy(h, 'Book a lounge', 'lng'); await ask('cancel my lounge'); await T(h, 'lng-cancel'); await click('Yes, cancel'); await T(h, 'lng-cancelled'); log('lounges left', (await h.state()).loungeLeft) })
  await S(async () => { await ask('my bookings'); await T(h, 'mine'); await ask('what have I booked?'); await T(h, 'mine2') })
  await S(async () => { await nav(4); await full('wallet-all') })
}
