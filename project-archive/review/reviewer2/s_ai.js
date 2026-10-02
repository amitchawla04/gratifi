module.exports = async (h) => { const { p, nav, log, shot, full, last, lastText } = h
  await p.waitForTimeout(500); await nav(3); log('mode', await p.locator('.app-mode').innerText().catch(()=>'?'))
  const ask = async t => { await p.fill('.gr-ask input', t); await p.press('.gr-ask input', 'Enter'); await p.waitForTimeout(300); await shot('streaming'); await p.waitForTimeout(2500) }
  await ask('flights to lisbon for two'); await last('ai1'); log('A1', (await lastText()).replace(/\n/g,' | ').slice(0, 300))
  await ask('freeze my card'); await last('ai2'); log('A2', (await lastText()).replace(/\n/g,' | ').slice(0, 300)); log('frozen', (await h.state()).card.frozen)
  await ask('this will fail'); await last('ai3'); log('A3', (await lastText()).replace(/\n/g,' | ').slice(0, 300))
  await ask('hello there'); await last('ai3b'); log('A3b', (await lastText()).replace(/\n/g,' | ').slice(0, 300))
  await ask('nope'); await last('ai4'); log('A4', (await lastText()).replace(/\n/g,' | ').slice(0, 300)); log('mode', await p.locator('.app-mode').innerText().catch(()=>'?'))
  await ask('freeze my card'); log('A5', (await lastText()).replace(/\n/g,' | ').slice(0, 300))
  const calls = await p.evaluate(() => window.__calls.map(c => ({ n: c.turns.length, roles: c.turns.map(t => t.role[0]).join(''), tools: c.tools.length, tier: c.tier, last: String(c.turns[c.turns.length - 1].content).slice(0, 40), hist: c.turns.slice(1, -1).map(t => String(t.content).slice(0, 80)) })))
  log(JSON.stringify(calls, null, 1)); await full('end')
  log('RULES', await p.evaluate(() => window.__calls[0].turns[0].content.slice(0, 3000)))
}
