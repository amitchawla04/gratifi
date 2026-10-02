const setup = require('./h.js'); const L = require('./lib.js')
module.exports = async () => { const h = await setup('UK', { tag: 'mm11' }); const { p, shot, nav, ask, btn, confirm, st, lastText, last } = h
  await nav(3); await L.bookFlight(h)
  await btn('Add a hotel'); console.log('H', (await lastText()).slice(0, 300))
  await last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(300); const t = await lastText(); console.log('HD', t.slice(t.indexOf('NIGHTS') - 30, t.indexOf('NIGHTS') + 200))
  await btn('Book a lounge'); console.log('L', (await lastText()).slice(0, 200)); await last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(300); const t2 = await lastText(); console.log('LD', t2.slice(0, 300))
  await btn('Airport ride'); console.log('R', (await lastText()).slice(0, 200))
  await h.close() }
