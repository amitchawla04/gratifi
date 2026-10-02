const setup = require('./h.js'); const L = require('./lib.js')
module.exports = async () => { const h = await setup('UK', { tag: 'mm4' }); const { p, shot, nav, ask, btn, confirm, st, lastText, last } = h
  await nav(3)
  await ask('Suite at Tidewater Rooms in Lisbon for 12 nights from 16 Oct for 8 guests')
  await p.locator('.gr-answer').last().locator('.gr-itemrow').first().click().catch(()=>{}); await p.waitForTimeout(400)
  const t = await lastText(); console.log('B', t.slice(t.indexOf('NIGHTS'), t.indexOf('NIGHTS') + 400)); await shot('detail', false)
  await last().getByText('Suite (+40%)').click(); await p.waitForTimeout(300); const t2 = await lastText(); console.log('C', t2.slice(t2.indexOf('NIGHTS'), t2.indexOf('NIGHTS') + 400))
  await last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(400); console.log('CO', (await lastText()).slice(0, 700)); 
  await last().getByText('Card', { exact: true }).click(); await btn(/^Pay /); console.log('SH', await confirm()); console.log('R', (await lastText()).slice(0, 400)); await shot('limit')
  console.log(JSON.stringify(await L.summ(h)))
  await ask("Noise-cancelling headphones"); await last().locator(".gr-itemrow").first().click(); await p.waitForTimeout(300); await last().locator(".gr-detail .gr-btn").last().click(); await p.waitForTimeout(300); const tq = await lastText(); console.log("CO2", tq.slice(-400)); await last().getByText("Card", { exact: true }).click(); await p.waitForTimeout(200); console.log("PAYBTN", await p.getByRole("button", { name: /^Pay / }).last().innerText(), await p.getByRole("button", { name: /^Pay / }).last().isEnabled()); await btn(/^Pay /).catch(e=>console.log("x")); console.log("SH2", await confirm()); console.log("R2", (await lastText()).slice(0, 300)); console.log(JSON.stringify(await L.summ(h)))
  await h.close() }
