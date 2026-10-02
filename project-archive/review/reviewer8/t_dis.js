const setup = require('./h.js')
;(async () => {
  const H = await setup('UK', { tag: 'dis', q: '&tab=chat' })
  const { p, ask, btn, shot, tall, money, lastAnswer, confirmSheet, S, last, nav } = H
  await ask('flights to Lisbon on 9 October back 10 October for two')
  await p.locator('.gr-flight').last().click(); await p.waitForTimeout(400)
  // choose earliest return option
  const opts = lastAnswer().locator('button', { hasText: /more each|less each|Chosen|same price/ })
  const texts = await opts.allInnerTexts(); console.log('return opts', JSON.stringify(texts))
  let idx = 0, best = 99; texts.forEach((t, i) => { const h = +t.slice(0, 2); if (h < best) { best = h; idx = i } }); await opts.nth(idx).click(); await p.waitForTimeout(300)
  await tall('fares')
  await btn(/Continue with/)
  const ins = lastAnswer().locator('input.app-in'); for (let i = 0; i < await ins.count(); i++) { if (!(await ins.nth(i).inputValue())) await ins.nth(i).fill('Sam Taylor') }
  await btn('Continue', { exact: true }); await btn(/^Pay /); await confirmSheet()
  let s = await S(); console.log('booked', s.bookings[0].when, s.bookings[0].extra.dep)
  await nav(5); await btn('Cancel my next flight'); await nav(3); await p.waitForTimeout(300)
  console.log('disruption:', (await last()).text); await tall('disruption')
  await btn('Next flight', { exact: true }).catch(e => console.log('no next flight btn')); console.log('after next:', (await last()).text); await tall('after')
  s = await S(); console.log('now', s.bookings[0].when, s.bookings[0].status)
  await H.done()
})()
