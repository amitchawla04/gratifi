const setup = require('./h.js'); const L = require('./lib.js')
module.exports = async () => { const h = await setup('UK', { tag: 'mm8' }); const { p, shot, nav, ask, btn, confirm, st, lastText, last } = h
  await nav(3)
  await ask('Milk, eggs, bread and bananas'); await btn('Checkout'); await last().getByText('Card', { exact: true }).click(); await btn(/^Pay /); await confirm(); console.log('G', (await lastText()).slice(0, 300))
  await nav(5); await btn('Deliver my order'); await nav(3)
  await ask('the eggs in my grocery order were broken'); console.log('C1', (await lastText()).slice(0, 500)); await shot('claim')
  const boxes = last().locator('input[type=checkbox], [role=checkbox]'); console.log('boxes', await boxes.count())
  if (await boxes.count()) await boxes.nth(1).click()
  await p.waitForTimeout(200); console.log('C1b', (await lastText()).slice(-300))
  await btn(/Send|Refund/).catch(e => console.log('no send')); console.log('C2', (await lastText()).slice(0, 400)); await shot('claim-done')
  console.log(JSON.stringify(await L.summ(h)))
  // subs
  await ask('Start a streaming subscription'); await last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(300); await last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(300); await btn(/^Pay /); await confirm()
  await ask('cancel my Screenly subscription'); console.log('S1', (await lastText()).slice(0, 400)); const y = p.getByRole('button', { name: /^Yes/ }); if (await y.count()) { await y.last().click(); await p.waitForTimeout(400) } console.log('S2', (await lastText()).slice(0, 400))
  await ask('cancel my Netflix'); console.log('N', (await lastText()).slice(0, 300))
  await ask('cancel my Spotify subscription'); console.log('SP', (await lastText()).slice(0, 300))
  await ask('A gift card for a friend'); await last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(300); console.log('GC', (await lastText()).slice(0, 400))
  await ask('send a £37 gift card to sam@example.com'); console.log('GC2', (await lastText()).slice(0, 300))
  await h.close() }
