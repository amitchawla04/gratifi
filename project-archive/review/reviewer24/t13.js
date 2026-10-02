module.exports = async (h) => {
  const { p, say, log, lastAnswer, click, confirm, sheet, nav, full, st } = h
  await say('what do I owe'); await click('Set up Direct Debit'); log('  DD: ' + (await lastAnswer()).slice(0, 400)); log('  sheet ' + await sheet()); await full('dd')
  const b = p.locator('.gr-answer').last().locator('.gr-btn').last(); log('  btn ' + await b.innerText().catch(() => '')); await b.click().catch(() => {}); await p.waitForTimeout(400); log('  sheet ' + await sheet()); await confirm(); log('  ' + (await lastAnswer()).slice(0, 300))
  await nav(5); await full('me-dd')
  await say('I want to stop my direct debit'); log('  ' + (await lastAnswer()).slice(0, 300))
  await say('turn on the gambling block'); await click('Block gambling payments').catch(() => click(/Turn on|Block/)); log('  ' + (await lastAnswer()).slice(0, 300)); log('  sheet ' + await sheet())
  await say('take the gambling block off'); log('  ' + (await lastAnswer()).slice(0, 300)); log('  sheet ' + await sheet()); await confirm(); log('  ' + (await lastAnswer()).slice(0, 300))
  await nav(5); await full('me-gamb')
  const s = await st(); log(JSON.stringify(s.card))
}
