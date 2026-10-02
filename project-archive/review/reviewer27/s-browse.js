module.exports = async (h) => { const { p, click, nav, full, shot } = h
  await click('See flights'); await p.waitForTimeout(600); await full('promo-flights'); console.log('PROMO ->', (await h.last()).slice(0, 300))
  await nav(1); await click('Show ideas'); await p.waitForTimeout(600); console.log('IDEAS ->', (await h.last()).slice(0, 300))
  await nav(2); const n = await p.locator('.gr-cattile').count(); console.log('tiles', n)
  for (const i of [0, 1, 4, 9, 13, 16]) { await nav(2); await p.locator('.gr-cattile').nth(i).click(); await p.waitForTimeout(500); await full('cat' + i); const t = await p.evaluate(() => document.querySelector('.app-main').innerText.replace(/\n+/g, ' | ').slice(0, 500)); console.log('CAT', i, t)
    const sub = p.locator('.app-main .gr-chip, .app-main .gr-subtile, .app-main button.gr-itemrow').first(); if (await sub.count()) { await sub.click().catch(() => {}); await p.waitForTimeout(700); console.log('  SUB ->', (await h.last()).slice(0, 250)) } }
}
