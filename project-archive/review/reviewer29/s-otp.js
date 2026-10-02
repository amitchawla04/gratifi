module.exports = async (h) => { const { p, nav, say, sheet, state, shot } = h
  await nav(3); await say('Noise-cancelling headphones'); await p.locator('.gr-answer').last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(300)
  await p.locator('.gr-answer').last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(300)
  await p.getByRole('button', { name: /^Pay / }).last().click(); await p.waitForTimeout(300)
  const tryCode = async (code) => { const ins = await p.$$('.app-sheet input'); if (ins.length >= 6) { for (let i = 0; i < 6; i++) await ins[i].fill(code[i]) } else if (ins.length) await ins[0].fill(code); else console.log('no inputs'); await p.waitForTimeout(200); const b = p.locator('.app-sheet .gr-btn').last(); if (await b.count() && await b.isEnabled()) await b.click(); await p.waitForTimeout(900); console.log('after', code, '=>', (await sheet() || 'NO SHEET').slice(0, 350)) }
  await tryCode('111111'); await tryCode('222222'); await shot('otp2'); await tryCode('333333'); await shot('otp3')
  await p.keyboard.press('Escape'); await p.reload(); await p.waitForTimeout(800); await nav(3)
  await p.getByRole('button', { name: /^Pay / }).last().click(); await p.waitForTimeout(400); console.log('after reload:', (await sheet() || 'NO SHEET').slice(0, 300)); await shot('otp-reload')
  await tryCode('482193')
  const s = await state(); console.log('pts', s.balance, (s.bookings||[]).length)
}
