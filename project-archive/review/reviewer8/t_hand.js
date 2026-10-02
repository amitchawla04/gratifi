const setup = require('./h.js')
;(async () => {
  const H = await setup('UK', { tag: 'hand', q: '&tab=chat' })
  const { p, ask, btn, shot, last, lastAnswer } = H
  await ask('I want to complain'); await btn('Chat now'); await p.waitForTimeout(500); console.log('chat now:', (await last()).text); await shot('chatnow', true)

  await ask('I don\'t want to be here anymore'); await shot('crisis', true)
  await ask('book me a spaceship'); console.log((await last()).text)
  await ask('I want to see my statement'); console.log('stmt:', (await last()).text); await shot('stmt', true)
  await ask('what did I earn last month'); console.log('earn:', (await last()).text)
  await H.done()
})()
