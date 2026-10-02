const H = require('./h.js')
const m = process.argv[2] || 'IN'
H.run(async (h) => {
  const { p, ask, click, full, shot, confirm, money, log, sheet, nav } = h
  await nav(3)
  await ask('Noise-cancelling headphones'); await p.locator('.gr-answer').last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(300)
  await full('detail')
  await p.locator('.gr-answer').last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(400); await full('checkout')
  const fill = async (code) => { const ins = await p.$$('.app-sheet input'); if (!ins.length) { log('no inputs'); return } if (ins.length >= 6) { for (let i = 0; i < 6; i++) await ins[i].fill(code[i]) } else await ins[0].fill(code); await p.locator('.app-sheet .gr-btn').last().click(); await p.waitForTimeout(700) }
  const m0 = await money()
  await click(/^Pay /); await shot('sheet')
  if (m === 'IN') {
    await fill('111111'); await fill('222222'); await fill('333333'); log('after 3 wrong:', (await sheet() || '').replace(/\s+/g, ' ').slice(0, 400)); await shot('locked')
    await p.reload(); await p.waitForTimeout(800); await nav(3)
    const pb2 = p.getByRole('button', { name: /^Pay / }).last(); log('pay btn count after reload', await pb2.count())
    if (await pb2.count()) { await pb2.scrollIntoViewIfNeeded(); await pb2.click(); await p.waitForTimeout(400); log('after reload:', (await sheet() || '').replace(/\s+/g, ' ').slice(0, 300)); await shot('locked-reload') }
    await p.keyboard.press('Escape')
  } else {
    log('sheet:', (await sheet() || '').replace(/\s+/g, ' ').slice(0, 400))
    await p.locator('.app-sheet .gr-btn').last().click(); await p.waitForTimeout(600); await shot('approving'); log('sheet2:', (await sheet() || '').replace(/\s+/g, ' ').slice(0, 300))
    await p.waitForSelector('.app-sheet', { state: 'detached', timeout: 15000 }).catch(() => log('SHEET STUCK'))
    await full('receipt')
  }
  log('money', JSON.stringify(m0), '->', JSON.stringify(await money()))
  await ask('Flights to Penang next weekend for two'); await p.locator('.gr-flight').first().click().catch(() => {}); await p.waitForTimeout(400); await full('fares')
  await ask('A table tonight for two'); await full('dining')
  await ask('a hotel in penang'); await full('stays')
  await nav(5); await full('me')
}, { m, tag: 'buy2' })
