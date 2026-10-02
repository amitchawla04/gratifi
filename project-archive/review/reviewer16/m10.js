const setup = require('./h.js'); const L = require('./lib.js')
module.exports = async () => { const h = await setup('UK', { tag: 'mm10' }); const { p, shot, nav, ask, btn, confirm, st, lastText, last } = h
  await nav(3); await ask('show me challenges'); console.log('CH0', (await lastText()).slice(0, 400))
  await nav(5); await btn('Points come in (+5,000)'); console.log(JSON.stringify(await L.summ(h)).slice(0, 200)); console.log('toast', await p.evaluate(() => document.querySelector('.app-toast, [role=status]')?.textContent))
  await btn('A card payment'); await btn('A card payment'); 
  await nav(3); await ask('show me challenges'); console.log('CH1', (await lastText()).slice(0, 400))
  await ask('Shop at Stride Outdoor'); console.log('AFF', (await lastText()).slice(0, 300)); await last().locator('.gr-itemrow').first().click().catch(()=>{}); await p.waitForTimeout(300); console.log('AFF2', (await lastText()).slice(0, 400)); await shot('aff')
  const b = p.getByRole('button', { name: /Shop on|Go to|Open|Visit/ }); if (await b.count()) { await b.last().click(); await p.waitForTimeout(500); console.log('AFF3', (await lastText()).slice(0, 300)) }
  console.log(JSON.stringify(await L.summ(h)))
  await nav(5); await btn('Return window ends'); await p.waitForTimeout(300); await nav(3); console.log('RW', (await lastText()).slice(0, 300))
  await nav(5); await btn('Suspicious payment'); await p.waitForTimeout(300); console.log('SUS', (await lastText()).slice(0, 400)); await shot('sus')
  await nav(5); await btn('Reset demo'); await p.waitForTimeout(500); console.log(JSON.stringify(await L.summ(h)))
  await h.close() }
