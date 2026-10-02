module.exports = async ({ p, nav, ask, click, full, shot, summ, lastText, log }) => {
  await nav(3); await ask('Flights to Lisbon next weekend for two'); await full('results'); log('R:', (await lastText()).slice(0, 1500))
  await p.locator('.gr-flight').first().click(); await p.waitForTimeout(500); await full('fares'); log('F:', (await lastText()).slice(0, 1500))
  await click(/Continue with/); await full('seats'); log('S:', (await lastText()).slice(0, 1000))
  await click('Continue', true); await full('checkout'); log('C:', (await lastText()).slice(0, 1500))
  await summ('before pay')
  await click(/^Pay /); await p.waitForTimeout(300); await shot('sheet'); log('SHEET:', await p.locator('.app-sheet').innerText().catch(() => 'none'))
  await p.locator('.app-sheet .gr-btn').last().click(); await p.waitForSelector('.app-sheet', { state: 'detached', timeout: 9000 }).catch(() => log('SHEET STUCK')); await p.waitForTimeout(600)
  await full('receipt'); log('RC:', (await lastText()).slice(0, 1500))
  await summ('after pay')
}
