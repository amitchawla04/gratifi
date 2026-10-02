const setup = require('./h.js')
;(async () => {
  const H = await setup('UK', { tag: 'misc', q: '&tab=chat' })
  const { p, ask, btn, shot, tall, money, lastAnswer, confirmSheet, S, last, nav } = H
  await ask('Travel insurance'); await btn('Get this cover'); await p.waitForTimeout(300); await shot('ins-elig', true)
  console.log('ins block:', (await lastAnswer().innerText()).slice(-500).replace(/\n/g, ' / '))
  // transfer re-tap after reload
  await ask('Transfer points to miles'); await lastAnswer().locator('.gr-ack input').first().check(); await lastAnswer().locator('.gr-btn').first().click(); await p.waitForTimeout(300)
  await lastAnswer().locator('input.app-in').fill('NW4821930'); await lastAnswer().locator('.gr-btn').last().click(); await p.waitForTimeout(300); await confirmSheet()
  const m1 = await money(); await p.reload(); await p.waitForTimeout(700)
  const en = await p.$$eval('.gr-answer button:not([disabled])', xs => xs.map(x => x.innerText.trim().replace(/\n/g, ' ')).filter(Boolean)); console.log('enabled after reload:', JSON.stringify(en))
  // try old membership Continue
  // old OTP? price rise continue re-tap
  await nav(5); await p.locator('.app-demo [role=switch]').nth(0).click(); await nav(3)
  await ask('Leather trainers'); await lastAnswer().locator('.gr-itemrow').first().click(); await p.waitForTimeout(300); await lastAnswer().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(300)
  await btn(/^Pay /); console.log('rise:', (await last()).text); await btn(/^Continue at/); await btn(/^Pay /); await confirmSheet(); console.log('paid:', (await last()).text)
  const cont = p.getByRole('button', { name: /^Continue at/ }); console.log('continue-at enabled?', await cont.last().isEnabled())
  if (await cont.last().isEnabled()) { await cont.last().click(); await p.waitForTimeout(300); console.log('re-tap continue:', (await last()).text) }
  await H.done()
})()
