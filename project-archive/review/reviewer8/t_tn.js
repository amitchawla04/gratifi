const setup = require('./h.js')
;(async () => {
  const H = await setup('UK', { tag: 'tn', q: '&tab=chat' })
  const { p, ask, shot, lastAnswer } = H
  await ask('A table tonight for two'); await lastAnswer().locator('.gr-itemrow').first().click(); await p.waitForTimeout(400)
  console.log(await p.$$eval('.gr-answer:last-of-type [aria-pressed=true]', xs => xs.map(x => x.innerText)))
  await shot('tonight', true)
  await H.done()
})()
