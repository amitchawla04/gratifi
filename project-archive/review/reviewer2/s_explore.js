module.exports = async (h) => { const { p, nav, log, full, url } = h
  await nav(2); const n = await p.locator('.gr-cattile').count(); log('tiles', n)
  for (let i = 0; i < n; i++) { await nav(2); const t = p.locator('.gr-cattile').nth(i); const name = (await t.innerText()).split('\n')[0]; await t.click(); await p.waitForTimeout(400)
    const txt = (await p.locator('.app-main').innerText()).replace(/\n/g, ' | '); log(`## ${name}: ${txt.slice(0, 500)}`); if ([0, 5, 9, 12, 16].includes(i)) await full('cat-' + name.replace(/\W/g, ''))
    const back = p.locator('.app-main [aria-label="Back"]'); if (await back.count()) await back.first().click(); else log('!! no back on', name); await p.waitForTimeout(200) }
}
