const setup = require('./h.js')
module.exports = async () => { const h = await setup('UK', { tag: 'ai1', fake: true }); const { p, shot, nav, ask, btn, confirm, st, lastText, last } = h
  await nav(3); console.log('mode', await p.evaluate(() => document.querySelector('.app-mode')?.textContent))
  const plan = async (code, text) => { await p.evaluate(c => { window.__plan = eval(c) }, code); await ask(text, 1200); const r = await p.evaluate(() => JSON.stringify(window.__res || []).slice(0, 900)); console.log('>> ' + text + '\n   RES ' + r + '\n   UI ' + (await lastText()).slice(0, 400) + ((await p.$('.app-sheet')) ? ' [SHEET]' : '')); await p.keyboard.press('Escape'); await p.waitForTimeout(200) }
  // 1: turns structure
  await plan(`async (turns,o,run) => { window.__t = turns; return 'ok' }`, 'hello')
  console.log(JSON.stringify(await p.evaluate(() => window.__t.map(t => [t.role, String(t.content).slice(0, 80)]))))
  // stays: rooms math, nights 0, past date
  await plan(`async (t,o,run) => { const r = await run('search_catalogue', {category:'stays', city:'Lisbon', date:'2026-10-16', nights:4, guests:5}); return 'x' }`, 'hotel lisbon 5 guests')
  const ids = await p.evaluate(() => JSON.stringify(window.__res[0]?.r?.data || {}).slice(0, 600)); console.log('DATA', ids)
  await h.close() }
