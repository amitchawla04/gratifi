module.exports = async (h) => { const { p, say, click, state, nav, sheet } = h
  await nav(3); await say('pay the minimum'); await click(/^Pay /)
  const enter = async (code) => { const ins = await p.$$('.app-sheet input'); for (let i = 0; i < 6; i++) await ins[i].fill(code[i]); await p.waitForTimeout(200); const b = p.locator('.app-sheet .gr-btn').last(); if (await b.isEnabled()) await b.click(); await p.waitForTimeout(700); console.log('after', code, '=>', (await sheet() || 'NO SHEET').slice(0, 400)) }
  await enter('111111'); await enter('222222'); await h.shot('otp-2wrong'); await enter('333333'); await h.shot('otp-locked')
  await p.reload(); await p.waitForTimeout(800); await nav(3); await say('pay the minimum'); await click(/^Pay /).catch(e => console.log('pay click', e.message.slice(0, 60))); await p.waitForTimeout(500); console.log('AFTER RELOAD SHEET:', (await sheet() || 'none').slice(0, 400)); console.log('LAST:', (await h.last()).slice(0, 300)); await h.shot('otp-reload')
  const s = await state(); console.log('card', JSON.stringify(s.card))
}
