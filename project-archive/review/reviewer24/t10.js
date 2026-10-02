module.exports = async (h) => {
  const { p, say, log, lastAnswer, click, confirm, st, full, nav } = h
  const S = async (l) => { const s = await st(); log(`  [${l}] pts=${s.balance} card.bal=${s.card.balance} bookings=${JSON.stringify(s.bookings.map(b => [b.title.slice(0, 22), b.status, b.total, b.pts, b.card, b.earned]))}`) }
  await say('Flights to Lisbon next weekend for two')
  await p.locator('.gr-flight').first().click(); await p.waitForTimeout(400); await click(/Continue with/)
  { const ins = p.locator('.gr-answer').last().locator('input.app-in'); for (let i = 0; i < await ins.count(); i++) { if (!(await ins.nth(i).inputValue())) await ins.nth(i).fill('Sam Taylor') } }
  await click('Add a checked bag', {}).catch(() => {}); const plus = p.locator('.gr-answer').last().getByRole('button', { name: /increase|more|add|\+/i }); log('plus ' + await plus.count()); await plus.last().click().catch(() => {})
  await click('Continue', { exact: true }); log('  CHECKOUT ' + (await lastAnswer()).slice(0, 700))
  await click(/^Pay /); await confirm(); await S('booked')
  await say('cancel my flight'); log('  ' + (await lastAnswer()).slice(0, 800)); await full('flight-cancel-ask')
  await click('Yes, cancel').catch(e => log('no yes')); await p.waitForTimeout(500); log('  ' + (await lastAnswer()).slice(0, 600)); await S('cancelled')
  await nav(4); await full('wallet-after')
}
