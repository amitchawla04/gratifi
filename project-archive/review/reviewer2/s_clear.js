module.exports = async (h) => { const { p, nav, ask, click, shot, log, state } = h
  await nav(3); await ask('Flights to Lisbon'); await click('Clear'); await p.waitForTimeout(400); await shot('after-clear'); log('chat len', (await state()).chat.length, 'sheet/confirm?', await p.locator('.app-sheet').count())
  log('text', (await p.locator('.app-main').innerText()).slice(0, 200).replace(/\n/g, ' | '))
}
