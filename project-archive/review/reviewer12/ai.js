const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 420, height: 1000 } })
  const errs = []; p.on('pageerror', e => errs.push(e.message))
  await p.goto('file://' + __dirname + '/build/test-ai.html?m=UK'); await p.evaluate(() => localStorage.clear()); await p.reload(); await p.waitForTimeout(600)
  await p.click('.gr-nav button:nth-child(3)'); await p.waitForTimeout(300)
  const ask = async t => { await p.fill('.gr-ask input', t); await p.press('.gr-ask input', 'Enter'); await p.waitForTimeout(2500) }
  await ask('flights to lisbon for two'); await p.screenshot({ path: 'shots/ai-1.png' })
  await ask('freeze my card'); await p.screenshot({ path: 'shots/ai-2.png' })
  await ask('this will fail'); await p.screenshot({ path: 'shots/ai-3.png' })
  await ask('nope'); await ask('freeze my card'); await p.screenshot({ path: 'shots/ai-4.png' })
  console.log(JSON.stringify(await p.evaluate(() => ({ calls: window.__calls.map(c => ({ n: c.turns.length, roles: c.turns.map(t => t.role).join(''), tools: c.tools.length, tier: c.tier, cache: c.cache, lastTurn: c.turns[c.turns.length - 1].content.slice(0, 40), prev: c.turns.slice(1, -1).map(t => t.content.slice(0, 60)) })), mode: document.querySelector('.app-mode').textContent }))), errs)
  await b.close()
})()
