module.exports = async (h) => { const { p, nav, say, click, confirm, state, sheet, full, last } = h
  const S = async (l) => { const s = await state(); console.log('STATE', l, 'pts', s.balance, 'card', JSON.stringify(s.card), 'alerts', Object.keys(s.seen||{}).filter(k=>k.startsWith('alert:'))) }
  await nav(3)
  await say('milk, eggs and bread')
  await say('add 3 bananas and 2 more milk, remove the eggs')
  await say('make the bread 2 and add some coffee')
  await say('actually no milk')
  await full('groc')
  await say('block gambling'); await click('Block gambling payments'); await p.waitForTimeout(400); await S('gamb on')
  await say('lift the gambling block'); const sh = await sheet(); console.log('LIFT SHEET', sh); if (sh) await confirm(); console.log('AFTER LIFT', (await last()).slice(0,400)); await S('lift pending')
  await nav(5); await full('me-gamb'); const me = (await p.locator('.app-main').innerText()).replace(/\n+/g,' | '); console.log('ME', me.slice(0,700))
  const keep = p.getByRole('button', { name: /Keep the block/ }); console.log('keep btn', await keep.count()); if (await keep.count()) { await keep.first().click(); await p.waitForTimeout(400); if (await sheet()) await confirm(); await S('kept') }
  await click('Full balance'); console.log('DD SHEET', await sheet()); await confirm(); await S('dd set')
  await full('me-dd'); console.log('ME2', (await p.locator('.app-main').innerText()).replace(/\n+/g,' | ').slice(0,600))
  await nav(3); await say('change my direct debit to the minimum'); console.log('DDCH', await sheet()); if (await sheet()) await confirm(); await S('dd min')
  await say('cancel my direct debit'); console.log('DDX', await sheet()); if (await sheet()) await confirm(); await S('dd x')
  await say('remind me when my bill is due'); await say('remind me when Lisbon flights get cheaper'); await nav(5); await full('me-alerts')
  console.log('ME3', (await p.locator('.app-main').innerText()).replace(/\n+/g,' | ').slice(0,900))
}
