const setup = require('./h.js'); const L = require('./lib.js')
module.exports = async () => { const h = await setup('UK', { tag: 'mm3' }); const { p, shot, nav, ask, btn, confirm, st, lastText, last } = h
  await nav(3)
  await L.bookFlight(h, 'Flights to Lisbon 16 Oct back 20 Oct for 2', ['Priya Chawla'])
  for (const q of ['move my return flight to 22 October', 'can I come back later on the 20th', 'change my flight back to the evening', 'move my outbound to the 15th', 'change my flight to Friday 23rd']) { await ask(q); console.log('>> ' + q + '\n   ' + (await lastText()).slice(0, 450)) }
  await h.close() }
