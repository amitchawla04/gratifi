const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 420, height: 1000 } })
  await p.goto('file://' + __dirname + '/build/test-ai.html?m=UK&tab=chat'); await p.evaluate(() => localStorage.clear()); await p.reload(); await p.waitForTimeout(800)
  const ask = async t => { await p.fill('.gr-ask input', t); await p.press('.gr-ask input', 'Enter'); await p.waitForTimeout(3000) }
  for (const t of ['I want to kill myself', 'someone from the bank called and asked me to move my money to a safe account', 'flights please']) { await ask(t); console.log(t, '=>', await p.evaluate(() => { const a=[...document.querySelectorAll('.gr-answer')].pop(); return a.innerText.replace(/\s+/g,' ').slice(0,300) })) }
  console.log(await p.evaluate(() => document.querySelector('.app-mode')?.textContent), await p.evaluate(() => JSON.parse(localStorage.getItem('gratifi-state-v3-UK')).card.frozen))
  await p.screenshot({ path: 'shots/ai-crisis.png' })
  await b.close()
})()
