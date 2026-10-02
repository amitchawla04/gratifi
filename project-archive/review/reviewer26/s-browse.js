module.exports = async (h) => { const { p, nav, full, click } = h
  await click('See flights'); await p.waitForTimeout(800); console.log('BANNER ->', (await h.last()).slice(0, 400)); await full('banner')
  await nav(1); await p.locator('text=Tidewater House').first().click(); await p.waitForTimeout(800); console.log('FEATURED ->', (await h.last()).slice(0, 400)); await full('featured')
  await nav(1); await click('Add'); await p.waitForTimeout(500); await full('offer-add'); console.log('OFFER ADD ->', await p.evaluate(() => document.body.innerText.slice(0, 200)))
  await nav(2); await p.locator('.gr-cattile').nth(4).click(); await p.waitForTimeout(400); await full('cat-exp'); console.log('CAT PAGE:', (await p.locator('.app-main').innerText()).replace(/\n+/g, ' | ').slice(0, 600))
  const sub = p.locator('.app-main button, .app-main [role=button]').nth(3); console.log('clicking', await sub.innerText()); await sub.click(); await p.waitForTimeout(800); console.log('SUB ->', (await h.last()).slice(0, 400)); await full('sub-handoff')
}
