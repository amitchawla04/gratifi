const setup = require('./h.js'); const L = require('./lib.js')
module.exports = async () => { const h = await setup('UK', { tag: 'ukm' }); const { p, shot, nav, ask, btn, confirm, st, lastText, last } = h
  await nav(3); await L.bookFlight(h)
  await nav(4); await btn('Change date')
  await last().getByText('Sat 17 Oct', {exact:true}).click(); await p.waitForTimeout(300); console.log('A', await lastText())
  await last().locator('.gr-btn').last().click(); await p.waitForTimeout(500); console.log('B', await lastText()); await shot('cd-opts')
  const pay = p.getByRole('button', { name: /^Pay |^Move|^Change|^Confirm/ }).last(); console.log('btn', await pay.innerText().catch(()=>'-'))
  await pay.click(); const t = await confirm(); console.log('SHEET', t); console.log('C', await lastText()); await shot('cd-done')
  console.log(JSON.stringify(await L.summ(h)))
  await ask('move my outbound to 22 October'); console.log('D', await lastText())
  await ask('change my return flight to the evening'); console.log('E', await lastText()); await shot('ret-eve')
  await h.close() }
