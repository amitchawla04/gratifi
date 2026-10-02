module.exports = async (h) => {
  const { p, say, log, lastAnswer, full, click, confirm, st, sheet, nav, long, shot } = h
  const S = async (l) => { const s = await st(); log(`  [${l}] pts=${s.balance} card.bal=${s.card.balance} due=${s.card.due} frozen=${s.card.frozen} bookings=${JSON.stringify(s.bookings.map(b => [b.title.slice(0, 22), b.status]))}`) }
  const sw = async (i) => { await nav(5); await p.locator('.app-demo [role=switch]').nth(i).click(); await p.waitForTimeout(300) }
  const demo = async (name) => { await nav(5); await click(name); await p.waitForTimeout(600) }
  // supplier down
  await say('hello'); await sw(1); await nav(3)
  await say('A hotel in Lisbon'); await p.locator('.gr-answer').last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(400)
  await p.locator('.gr-answer').last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(400)
  await click(/^Pay /); await confirm(); log('  SUPPLIER DOWN: ' + (await lastAnswer()).slice(0, 400)); await S('after supplier down'); await full('supplier-down')
  await sw(1)
  await nav(3); const retry = p.getByRole('button', { name: /Try again|Pay /i }); log('  retry buttons ' + await retry.count())
  await retry.last().click().catch(() => log('  no retry')); await p.waitForTimeout(400); log('  sheet: ' + ((await sheet()) || '').slice(0, 200)); await confirm(); log('  RETRY: ' + (await lastAnswer()).slice(0, 300)); await S('after retry')
  // demo buttons
  await demo('Points come in (+5,000)'); await S('points in'); await long('me-after-points')
  await demo('A card payment'); await S('card payment'); await nav(3); await full('card-payment')
  await say('what did I just spend'); log('  ' + (await lastAnswer()).slice(0, 300))
  await demo('Suspicious payment'); await S('suspicious'); await full('suspicious')
  log('  ' + (await lastAnswer()).slice(0, 500))
  await say('yes that was me'); log('  ' + (await lastAnswer()).slice(0, 400))
  await demo('Cancel my next flight'); log('  no flight: ' + (await lastAnswer()).slice(0, 300))
  await demo('Delay my order'); log('  no order: ' + (await lastAnswer()).slice(0, 300))
  await demo('Deliver my order'); log('  ' + (await lastAnswer()).slice(0, 300))
  await demo('Return window ends'); log('  ' + (await lastAnswer()).slice(0, 300))
  await sw(2); await nav(3); await say('pay my bill in full'); await click(/^Pay /).catch(() => { }); await confirm(); log('  DECLINED BILL?: ' + (await lastAnswer()).slice(0, 300)); await S('bill with decline toggle'); await sw(2)
  await nav(5); await click('Reset demo'); await p.waitForTimeout(500); const s = await st(); log('  after reset: ' + JSON.stringify(s && { pts: s.balance, bal: s.card.balance, chat: s.chat.length, b: s.bookings.length }))
  await long('me-reset')
}
