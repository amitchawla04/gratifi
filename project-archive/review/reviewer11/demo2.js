const C = require('./book.js').C
require('./lib.js')('UK', 'demo2', async (h) => {
  const { p } = h
  await h.nav(5); await h.btn('Points come in (+5,000)'); await h.shot('pts-in')
  await h.btn('Reset demo'); await h.shot('reset1'); console.log('after reset click', (await p.locator('.app-demo').innerText()).replace(/\s+/g,' ').slice(-200), (await h.st()).balance)
  const yes = p.getByRole('button', { name: /reset|yes/i }); console.log(await yes.allInnerTexts())
  await h.btn('Suspicious payment'); await h.btn("It wasn't me"); await h.tail('notme'); console.log('NOTME', await h.text(), (await h.st()).card.frozen)
  await h.nav(5); await h.btn('Suspicious payment'); await h.btn('It was me'); console.log('WASME', await h.text(), (await h.st()).card.frozen)
})
