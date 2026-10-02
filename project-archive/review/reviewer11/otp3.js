const C = require('./book.js').C
require('./lib.js')('IN', 'otp3', async (h) => {
  const { p } = h
  await h.nav(3); await h.ask('Noise-cancelling headphones'); await C(h.last().locator('.gr-itemrow').first()); await p.waitForTimeout(300)
  await h.btn('Continue', { exact: true }); await C(h.last().locator('[role=radio]').nth(1)); await p.waitForTimeout(200)
  await h.btn(/^Pay /)
  const inp = p.locator('.app-sheet input').first()
  for (const c of ['111111', '222222', '333333']) { await inp.fill(c); await p.keyboard.press('Enter'); await p.waitForTimeout(400) }
  await p.evaluate(() => { const k = 'gratifi-state-v3-IN'; const s = JSON.parse(localStorage.getItem(k)); s.seen.otp.at -= 16 * 60000; localStorage.setItem(k, JSON.stringify(s)) })
  await p.reload(); await p.waitForTimeout(700); await h.nav(3)
  await p.getByRole('button', { name: /^Pay / }).last().evaluate(e => e.click()); await p.waitForTimeout(400); console.log('UNLOCKED?', await h.sheet())
  // paste
  await p.locator('.app-sheet input').first().focus()
  await p.evaluate(() => { const e = document.activeElement; const dt = new DataTransfer(); dt.setData('text/plain', '482 193'); e.dispatchEvent(new ClipboardEvent('paste', { clipboardData: dt, bubbles: true, cancelable: true })) })
  await p.waitForTimeout(300); console.log('vals', await p.locator('.app-sheet input').evaluateAll(es => es.map(e => e.value).join('')))
  await h.shot('pasted')
  const s0 = await h.st(); console.log('before', s0.balance, s0.card.balance)
  await p.keyboard.press('Enter'); await p.waitForTimeout(1500); console.log('sheet after enter', await h.sheet())
  const s1 = await h.st(); console.log('after', s1.balance, s1.card.balance, s1.bookings.length, JSON.stringify(s1.seen.otp))
  await h.tail('done'); console.log(await h.text())
})
