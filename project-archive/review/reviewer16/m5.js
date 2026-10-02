const setup = require('./h.js'); const L = require('./lib.js')
module.exports = async () => { const h = await setup('UK', { tag: 'mm5' }); const { p, shot, nav, ask, btn, confirm, st, lastText, last } = h
  await nav(3); await ask('hello'); await p.evaluate(() => { const k = 'gratifi-state-v3-UK'; const s = JSON.parse(localStorage.getItem(k)); s.card.balance = 7950; localStorage.setItem(k, JSON.stringify(s)) }); await p.reload(); await p.waitForTimeout(600)
  await nav(3); await ask('Noise-cancelling headphones'); await last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(300); await last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(300)
  console.log('CO', (await lastText()).slice(-400)); await shot('co')
  await last().getByText('Card', { exact: true }).click(); await p.waitForTimeout(200); await btn(/^Pay /); const s = await confirm(); console.log('SH', s); console.log('R', (await lastText()).slice(0, 400)); await shot('res')
  console.log(JSON.stringify(await L.summ(h)))
  await nav(5); await btn('A card payment'); await p.waitForTimeout(300); console.log(JSON.stringify(await L.summ(h)))
  await nav(3); await ask('Put 5000 points into gold'); 
  await h.close() }
