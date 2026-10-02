const setup = require('./h.js'); const L = require('./lib.js')
module.exports = async () => { const h = await setup('IN', { tag: 'in1' }); const { p, shot, nav, ask, btn, confirm, st, lastText, last } = h
  await nav(3)
  await ask('Flights to Goa on 16 Oct for 2 adults and a baby, back on 19 Oct')
  await p.locator('.gr-flight').first().click(); await p.waitForTimeout(500)
  await btn(/Continue with/)
  const ins = last().locator('input'); await ins.nth(1).fill('Neha Sharma'); await ins.nth(2).fill('Ira Sharma')
  for (const d of ['2024-10-18', '2026-10-20', '2024-09-01', '2025-03-01']) { await ins.nth(3).fill(d); await p.waitForTimeout(250); console.log(d, '|', (await last().locator('[role=status]').allInnerTexts()).join(' '), '|', await last().locator('.gr-btn').last().innerText()) }
  await btn('Continue', { exact: true }); console.log('CO', (await lastText()).slice(-700)); await shot('checkout', true)
  const s0 = await L.summ(h); console.log(JSON.stringify(s0))
  await btn(/^Pay /); await p.waitForTimeout(400); await shot('otp')
  const sheet = async () => (await (await p.$('.app-sheet')).innerText()).replace(/\s+/g, ' ')
  console.log('S0', await sheet())
  const enter = async (c) => { const ins = await p.$$('.app-sheet input'); if (ins.length >= 6) { for (let i = 0; i < 6; i++) await ins[i].fill(c[i]) } else await ins[0].fill(c); await p.waitForTimeout(200); const b = p.locator('.app-sheet .gr-btn').last(); if (await b.isEnabled()) await b.click(); await p.waitForTimeout(1500) }
  await enter('111111'); console.log('S1', await sheet())
  await enter('222222'); console.log('S2', await sheet()); await shot('otp-last')
  await enter('333333'); console.log('S3', await sheet()); await shot('otp-locked')
  console.log(JSON.stringify(await L.summ(h)))
  await p.reload(); await p.waitForTimeout(800); await nav(3)
  await btn(/^Pay /).catch(e => console.log('no pay btn after reload', e.message.slice(0, 80))); await p.waitForTimeout(400)
  const s = await p.$('.app-sheet'); console.log('AFTER RELOAD', s ? await sheet() : 'no sheet'); await shot('after-reload')
  await h.close() }
