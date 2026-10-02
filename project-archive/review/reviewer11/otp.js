const C = require('./book.js').C
require('./lib.js')('IN', 'otp', async (h) => {
  const { p } = h
  await h.nav(3); await h.ask('Noise-cancelling headphones'); await C(h.last().locator('.gr-itemrow').first()); await p.waitForTimeout(300)
  await h.btn('Continue', { exact: true }); await C(h.last().locator('[role=radio]').last()); await p.waitForTimeout(200)
  const s0 = await h.st(); console.log('before', s0.balance, s0.card.balance)
  await h.btn(/^Pay /); await h.shot('otp'); console.log('SHEET', await h.sheet())
  console.log(await p.locator('.app-sheet').evaluate(e => [...e.querySelectorAll('input,button')].map(b => `${b.tagName}|${b.type}|${b.getAttribute('aria-label')}|${b.getAttribute('inputmode')}|${b.getAttribute('autocomplete')}|${b.textContent.trim().slice(0,30)}|${b.disabled}`).join('\n')))
  const inp = p.locator('.app-sheet input').first()
  await inp.fill('111111'); await p.keyboard.press('Enter'); await p.waitForTimeout(600); console.log('W1', await h.sheet()); await h.shot('wrong1')
  await inp.fill('222222'); await p.locator('.app-sheet .gr-btn').last().click(); await p.waitForTimeout(600); console.log('W2', await h.sheet()); await h.shot('wrong2')
  let s = await h.st(); console.log('mid', s.balance, s.card.balance, s.bookings.length)
  await inp.fill('333333'); await p.keyboard.press('Enter'); await p.waitForTimeout(600); console.log('W3', await h.sheet()); await h.shot('locked')
  s = await h.st(); console.log('after3', s.balance, s.card.balance, s.bookings.length)
  await p.reload(); await p.waitForTimeout(800); await h.nav(3); await h.tail('reload')
  const pay = p.getByRole('button', { name: /^Pay / }).last(); console.log('pay btn exists', await pay.count(), await pay.isEnabled().catch(()=>null))
  if (await pay.count()) { await pay.evaluate(e => e.click()); await p.waitForTimeout(500); console.log('AFTER RELOAD SHEET', await h.sheet()); await h.shot('reload-sheet') }
  await p.waitForTimeout(2500); console.log('2.5s later', await h.sheet())
  // try other flows during lock
  await p.keyboard.press('Escape'); await p.waitForTimeout(300)
  await h.ask('freeze my card'); await h.ask('unfreeze my card'); console.log('UNFREEZE during lock', await h.text(), await h.sheet())
})
