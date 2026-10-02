module.exports = async (h) => {
  const { p, log, lastAnswer, click, nav, full, last } = h
  await nav(1); await click('See flights'); await p.waitForTimeout(800); log('  BANNER: ' + (await last(2)).slice(0, 500)); await full('banner')
  await nav(1); await click('Show ideas'); await p.waitForTimeout(800); log('  IDEAS: ' + (await last(2)).slice(0, 400))
  await nav(1); await p.locator('text=Tidewater House').first().click(); await p.waitForTimeout(800); log('  FEATURED: ' + (await lastAnswer()).slice(0, 400))
  await nav(1); await click('Add'); await p.waitForTimeout(500); log('  OFFER ADD: ' + (await p.evaluate(() => document.querySelector('.app-main').innerText.slice(0, 0))))
  await nav(2); await p.locator('.gr-cattile').first().click(); await p.waitForTimeout(300); await p.locator('.gr-itemrow').first().click().catch(() => log('no row')); await p.waitForTimeout(800); log('  EXPLORE ROW: ' + (await last(2)).slice(0, 400))
}
