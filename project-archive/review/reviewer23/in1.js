const H = require('./h.js')
H.run(async (h) => {
  const { p, ask, click, full, shot, confirm, money, log, sheet, nav } = h
  await full('home'); await nav(3)
  await ask('Flights to Goa next weekend for two'); await full('results')
  await p.locator('.gr-flight').first().click(); await p.waitForTimeout(400); await full('fares')
  await click(/Continue with/);
  { const ins = p.locator('.gr-answer').last().locator('input.app-in'); for (let i = 0; i < await ins.count(); i++) { if (!(await ins.nth(i).inputValue())) await ins.nth(i).fill('Priya Sharma') } }
  await full('seats'); await click('Continue', { exact: true }); await full('checkout')
  // choose card only
  await p.locator('.gr-answer').last().getByText('Card', { exact: true }).click().catch(e => log('no card opt'))
  const m0 = await money()
  await click(/^Pay /); await shot('otp-sheet')
  // wrong code twice
  const fill = async (code) => { const ins = await p.$$('.app-sheet input'); if (ins.length >= 6) { for (let i = 0; i < 6; i++) await ins[i].fill(code[i]) } else await ins[0].fill(code); await p.locator('.app-sheet .gr-btn').last().click(); await p.waitForTimeout(700) }
  await fill('111111'); log('after 1 wrong:', (await sheet() || '').replace(/\s+/g, ' ').slice(0, 250))
  await fill('222222'); log('after 2 wrong:', (await sheet() || '').replace(/\s+/g, ' ').slice(0, 250)); await shot('otp-lasttry')
  await fill('482193'); await p.waitForTimeout(800); log('sheet after right:', await sheet())
  await full('receipt'); log('money', JSON.stringify(m0), '->', JSON.stringify(await money()))
  // now lockout test on a small purchase
  await ask('Book a lounge'); await p.locator('.gr-answer').last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(300)
  await p.locator('.gr-answer').last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(400); await full('lounge-checkout')
  const pb = p.getByRole('button', { name: /^Pay / }).last(); if (await pb.count()) { await pb.click(); await p.waitForTimeout(300)
    await fill('111111'); await fill('222222'); await fill('333333'); log('after 3 wrong:', (await sheet() || '').replace(/\s+/g, ' ').slice(0, 300)); await shot('locked')
    await p.reload(); await p.waitForTimeout(800); await nav(3)
    const pb2 = p.getByRole('button', { name: /^Pay / }).last(); if (await pb2.count()) { await pb2.scrollIntoViewIfNeeded(); await pb2.click(); await p.waitForTimeout(400); log('after reload:', (await sheet() || '').replace(/\s+/g, ' ').slice(0, 300)); await shot('locked-reload') } else log('no pay btn after reload') }
  else { log('lounge free, text:', await h.lastText()) }
  await p.keyboard.press('Escape'); await nav(4); await full('wallet'); await nav(5); await full('me')
}, { m: 'IN', tag: 'in1' })
