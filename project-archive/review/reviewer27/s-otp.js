module.exports = async (h) => { const { p, say, click, confirm, state, nav, full, sheet, shot, url } = h
  await nav(3); await say('pay ₹5000 off my card'); console.log('SHEET0', await sheet())
  for (let k = 0; k < 3; k++) { const ins = await p.$$('.app-sheet input'); for (let i = 0; i < 6; i++) await ins[i].fill('111111'[i]); await p.locator('.app-sheet .gr-btn').last().click().catch(e => console.log('btn', e.message.slice(0, 60))); await p.waitForTimeout(600); console.log('TRY', k, await sheet()) }
  await shot('locked')
  await p.reload(); await p.waitForTimeout(800); await nav(3); await say('pay ₹5000 off my card'); console.log('AFTER RELOAD', await sheet()); await shot('reload-locked')
  const st = await state(); console.log('card', st.card.balance)
}
