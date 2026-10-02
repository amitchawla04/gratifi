const L = require('./lib.js')
module.exports = async (h) => { const { p, nav, ask, click, log, url, state } = h
  await nav(3); await ask('Flights to Lisbon next weekend for two'); await p.locator('.gr-answer').last().locator('.gr-flight').first().click(); await p.waitForTimeout(300); await click(/Continue with/); await click('Continue', true)
  const opt = p.locator('.gr-answer').last().getByText('Points', { exact: true }).last(); await opt.click().catch(e => log('no points opt')); await p.waitForTimeout(300)
  log('pay label with points-only (insufficient):', await p.locator('.gr-answer').last().getByRole('button', { name: /^Pay / }).last().innerText().catch(()=>'none'), 'disabled', await p.locator('.gr-answer').last().getByRole('button', { name: /^Pay / }).last().isDisabled().catch(()=>'?'))
  await h.last('insufficient')
  await p.locator('.gr-answer').last().getByText('Card', { exact: true }).last().click(); await p.waitForTimeout(200)
  // double tap pay
  const pb = p.locator('.gr-answer').last().getByRole('button', { name: /^Pay / }).last(); await pb.click(); await pb.click({ force: true, timeout: 1000 }).catch(()=>{})
  await p.waitForTimeout(300); log('sheets', await p.locator('.app-sheet').count())
  const fb = p.locator('.app-sheet .gr-btn').last(); await fb.click(); await fb.click({ force: true, timeout: 800 }).catch(()=>{}); await p.waitForTimeout(2500)
  let s = await state(); log('bookings after double tap', s.bookings.length, s.card.balance)
  // reload and try old stuff
  await p.goto(url('&tab=chat')); await p.waitForTimeout(800)
  const pays = p.getByRole('button', { name: /^Pay / }); log('pay buttons after reload', await pays.count())
  const fl = p.locator('.gr-flight').first(); await fl.click(); await p.waitForTimeout(400); log('after clicking old flight card:', (await h.lastText()).slice(0, 200).replace(/\n/g,' | '))
  const cont = p.getByRole('button', { name: /Continue with/ }); log('continue btns', await cont.count())
  if (await cont.count()) { await cont.last().click(); await p.waitForTimeout(300); await click('Continue', true); await p.locator('.gr-answer').last().getByText('Card', { exact: true }).last().click(); await click(/^Pay /); await L.confirm(h) }
  s = await state(); log('bookings now', s.bookings.map(b => b.title + ' ' + b.when + ' ' + b.status))
  await ask('Flights to Lisbon next weekend for two'); log('dup warning?', (await h.lastText()).slice(0, 200))
}
