require('./h.js')('IN', async (h) => {
  const { p, ask, click, full, confirm, nav, st, log, ans, shot, sheet } = h
  await nav(3)
  await ask('Freeze my card')
  await ask('unfreeze my card')
  log('SHEET0 ' + await sheet()); await shot('otp0')
  const enter = async (code) => { const ins = await p.$$('.app-sheet input'); if (ins.length >= 6) { for (let i = 0; i < 6; i++) await ins[i].fill(code[i]) } else await ins[0].fill(code); await p.locator('.app-sheet .gr-btn').last().click(); await p.waitForTimeout(700); log('AFTER ' + code + ': ' + await sheet()) }
  await enter('111111'); await enter('222222'); await shot('otp-last'); await enter('333333'); await shot('otp-locked')
  await p.reload(); await p.waitForTimeout(800); await nav(3)
  await ask('unfreeze my card'); log('RELOAD SHEET ' + await sheet()); await shot('otp-reload')
  await p.keyboard.press('Escape'); await p.waitForTimeout(300)
  await ask('pay my bill'); 
  await p.getByRole('button', { name: /^Pay / }).last().click().catch(e=>log('nobtn')); await p.waitForTimeout(500); log('PAY SHEET ' + await sheet())
  log(JSON.stringify(await p.evaluate(()=>Object.keys(localStorage).map(k=>k+':'+localStorage.getItem(k).slice(0,80)))))
}, { name: 'otp', len: 400 })
