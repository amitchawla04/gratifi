const setup = require('./h.js'); const L = require('./lib.js')
module.exports = async () => { const h = await setup('UK', { tag: 'mm7' }); const { p, shot, nav, ask, btn, confirm, st, lastText, last } = h
  await nav(3)
  const S = async () => { const s = await st(); return `bal ${s.card.balance} due ${s.card.due} min ${s.card.min} pts ${s.balance}` }
  await ask('pay £500 off my card'); console.log('A', await lastText()); console.log(await confirm()); console.log('A2', await lastText(), await S())
  await ask('what do I owe?'); console.log('B', (await lastText()).slice(0, 250))
  await ask('pay the minimum'); console.log('C', (await lastText()).slice(0, 250))
  await p.keyboard.press('Escape')
  await ask('set up direct debit'); await btn('Set up Direct Debit'); console.log('DD', (await lastText()).slice(0, 400)); await shot('dd')
  const sh = await p.$('.app-sheet'); if (sh) { console.log('DDsheet', await confirm()); console.log('DD2', (await lastText()).slice(0, 300)) }
  await ask('block gambling'); await btn('Block gambling payments'); const g = await p.$('.app-sheet'); console.log('G', g ? await confirm() : 'no sheet', (await lastText()).slice(0, 250))
  await ask('remove the gambling block'); console.log('G2', (await lastText()).slice(0, 300)); const g2 = await p.$('.app-sheet'); if (g2) { console.log(await confirm()); console.log('G3', (await lastText()).slice(0, 300)) }
  await ask('remove the gambling block'); console.log('G4', (await lastText()).slice(0, 300)); await p.keyboard.press('Escape')
  await ask('my card is damaged'); console.log('DMG', (await lastText()).slice(0, 300)); await btn('Send a replacement'); console.log('REP', await confirm(), (await lastText()).slice(0, 300))
  await ask('Where did my money go?'); console.log('SP', (await lastText()).slice(0, 400))
  await h.close() }
