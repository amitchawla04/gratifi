(async () => {
  const H = await require('./h.js')('UK', 'light', 'uk-ret')
  const { p, full, nav, ask, click, last, st, lastMsg, done } = H
  const L = require('./lib.js')(H)
  await nav(3); await ask('hello'); const a = await L.snap()
  await ask('Rain shell jacket'); await L.pickFirst(); await L.cta(); console.log(await L.payIt('Card'))
  await ask('I want to return my jacket'); await L.log('ret'); await click('Book free collection'); await L.log('ret2')
  await ask('my jacket arrived damaged'); await L.log('claim'); 
  // stay booking claim
  await ask('hotel in Paris'); await L.pickFirst(); await L.cta(); console.log(await L.payIt())
  await ask('problem with my hotel'); await L.log('hclaim'); await click("Service wasn't delivered"); await click('Send claim'); await L.log('hclaim2')
  await p.waitForTimeout(46000)
  const s = await st(); console.log(s.chat.slice(-3).map(m => m.text).join(' || '))
  console.log('bookings', s.bookings.map(b => b.title + ':' + b.status).join(', '))
  const b = await L.snap(); console.log('net', L.diff(a, b))
  await nav(4); await full('wallet')
  console.log(await done())
})()
