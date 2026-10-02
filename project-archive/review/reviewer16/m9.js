const setup = require('./h.js'); const L = require('./lib.js')
module.exports = async () => { const h = await setup('UK', { tag: 'mm9' }); const { p, shot, nav, ask, btn, confirm, st, lastText, last } = h
  await nav(3)
  await ask('Rain shell jacket'); await last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(300); await last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(300); await last().getByText('Points and card', { exact: true }).click(); await btn(/^Pay /); await confirm()
  const s0 = await L.summ(h); console.log(JSON.stringify(s0))
  await nav(5); await btn('Deliver my order'); await nav(3)
  await ask('return my jacket'); console.log('R1', (await lastText()).slice(0, 400)); const y = p.getByRole('button', { name: /^(Book free collection)/ }); if (await y.count()) { await y.last().click(); await p.waitForTimeout(400) } console.log('R2', (await lastText()).slice(0, 400)); await shot('return')
  await p.reload(); await p.waitForTimeout(36000); await nav(4); await p.getByText('Orders', {exact:true}).first().click(); await p.waitForTimeout(300); console.log('W', (await p.locator('.app-main').innerText()).replace(/\s+/g, ' ').slice(0, 400))
  console.log(JSON.stringify(await L.summ(h)))
  // supplier down
  await nav(5); await p.locator('.app-demo [role=switch]').nth(1).click(); await nav(3)
  const b = await L.summ(h)
  await ask('Transfer 2000 points to Northway'); console.log('T', (await lastText()).slice(0, 300)); const sh = await p.$('.app-sheet'); if (sh) console.log(await confirm()); console.log('T2', (await lastText()).slice(0, 300))
  await ask('A hotel in Paris for 2 nights from 10 Oct'); await last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(300); await last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(300); await btn(/^Pay /); console.log('SH', await confirm()); console.log('H', (await lastText()).slice(0, 300))
  console.log(JSON.stringify(b) === JSON.stringify(await L.summ(h)) ? 'UNCHANGED' : 'CHANGED ' + JSON.stringify(await L.summ(h)))
  await h.close() }
