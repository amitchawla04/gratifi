const setup = require('./h.js')
;(async () => {
  const H = await setup('UK', { tag: 'demo', q: '&tab=me' })
  const { p, ask, btn, shot, tall, money, lastAnswer, confirmSheet, S, last, nav } = H
  const log = async (l) => console.log(l, JSON.stringify(await money()))
  const lastMsgs = async (n = 2) => { const s = await S(); return s.chat.slice(-n).map(m => m.role + ': ' + (m.text || '') + ' [' + (m.blocks || []).map(b => b.kind).join(',') + ']').join('\n    ') }
  if (!process.env.LATE) { await btn(/Points come in/); await log('points in'); console.log('   ', await lastMsgs(1))
  await btn('A card payment'); await log('card payment'); console.log('   ', await lastMsgs(1))
  await nav(3); await tall('after-2-controls'); await nav(5)
  // supplier down
  await p.locator('.app-demo [role=switch]').nth(1).click(); await p.waitForTimeout(200)
  await nav(3); const m0 = await money()
  await ask('A hotel in Lisbon with a pool'); await lastAnswer().locator('.gr-itemrow').first().click(); await p.waitForTimeout(300); await lastAnswer().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(300)
  await btn(/^Pay /); console.log('sheet opened on supplier down?', !!(await p.$('.app-sheet'))); if (await p.$('.app-sheet')) await confirmSheet()
  console.log('supplier down reply:', (await last()).text); const m1 = await money(); console.log('unchanged?', JSON.stringify(m0) === JSON.stringify(m1), JSON.stringify(m1))
  await shot('supplier-down', true)
  await btn('Try again'); console.log('try again:', (await last()).text)
  await nav(5); await p.locator('.app-demo [role=switch]').nth(1).click(); await nav(3)
  await tall('after-try'); { const pay = p.getByRole('button', { name: /^Pay / }); console.log('pay btns', await pay.count()); await pay.last().click(); await p.waitForTimeout(300); await confirmSheet() }
  console.log('after supplier back:', (await last()).text); await log('hotel')
  // shopping on card, deliver, return with reload in between
  await ask('Rain shell jacket'); await lastAnswer().locator('.gr-itemrow').first().click(); await p.waitForTimeout(300); await lastAnswer().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(300)
  await tall('jacket-checkout')
  await p.getByRole('radio', { name: /^Card/ }).last().click(); await btn(/^Pay /); await confirmSheet(); await log('jacket')
  await nav(5); await btn('Deliver my order'); await nav(3); console.log('deliver:', await lastMsgs(1))
  await ask('return my jacket'); console.log('return ask:', (await last()).text); await tall('return-form')
  const rb = lastAnswer().locator('.gr-btn'); console.log('return buttons', await rb.allInnerTexts()); await rb.last().click(); await p.waitForTimeout(400)
  console.log('return booked:', (await last()).text)
  await p.waitForTimeout(8000); await p.reload(); await p.waitForTimeout(1000); await log('mid-return after reload')
  await p.waitForTimeout(24000); await log('after return'); console.log('   ', await lastMsgs(1))
  await tall('return-done')
  // affiliate
  await ask('Earn extra points shopping'); await tall('affiliate-list')
  await lastAnswer().locator('.gr-itemrow').first().click(); await p.waitForTimeout(300); await tall('affiliate-detail')
  await lastAnswer().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(400); console.log('link:', (await last()).text)
  const ib = p.getByRole('button', { name: /I bought something/ }); if (await ib.count()) { await ib.last().click(); await p.waitForTimeout(300); console.log('bought:', (await last()).text) }
  let s = await S(); console.log('pending', JSON.stringify(s.pending)); await nav(1); await tall('home-pending'); await nav(5)
  await btn('Return window ends'); await p.waitForTimeout(300); await log('after window'); console.log('   ', await lastMsgs(1))
  console.log('rw button still there', await p.getByRole('button', { name: 'Return window ends' }).count())
  }
  // suspicious
  await btn('Suspicious payment'); await p.waitForTimeout(300); console.log('susp:', await lastMsgs(1)); await nav(3); await tall('suspicious'); await nav(5)
  s = await S(); console.log('frozen', s.card.frozen)
  // Delay with nothing, cancel next flight with none
  await btn('Delay my order'); console.log('delay none:', await lastMsgs(1))
  await btn('Cancel my next flight'); console.log('cancel none:', await lastMsgs(1))
  await btn('Deliver my order'); console.log('deliver none:', await lastMsgs(1))
  // price rise toggle state visible
  await btn('Reset demo'); await p.waitForTimeout(400); console.log('reset sheet/dialog?', !!(await p.$('.app-sheet')), await p.evaluate(() => document.querySelector('.app-sheet')?.innerText)); if (await p.$('.app-sheet')) { await p.locator('.app-sheet .gr-btn').last().click(); await p.waitForTimeout(400) }
  await log('after reset'); await shot('after-reset')
  await H.done()
})()
