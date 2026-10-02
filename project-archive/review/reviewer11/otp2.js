const C = require('./book.js').C
require('./lib.js')('IN', 'otp2', async (h) => {
  const { p } = h
  await h.nav(3); await h.ask('Noise-cancelling headphones'); await C(h.last().locator('.gr-itemrow').first()); await p.waitForTimeout(300)
  await h.btn('Continue', { exact: true }); await C(h.last().locator('[role=radio]').last()); await p.waitForTimeout(200)
  await h.btn(/^Pay /)
  const inp = p.locator('.app-sheet input').first()
  for (const c of ['111111', '222222', '333333']) { await inp.fill(c); await p.keyboard.press('Enter'); await p.waitForTimeout(400) }
  console.log('LS', await p.evaluate(() => Object.keys(localStorage).map(k => k + '=' + (k.startsWith('gratifi-state') ? '[state]' : localStorage.getItem(k))).join(' ; ')))
  const s = await h.st(); console.log('seen keys', Object.keys(s.seen).filter(k => /otp|lock|code/i.test(k)).map(k => k + '=' + JSON.stringify(s.seen[k])))
  // wait a minute to see countdown
  await p.waitForTimeout(62000); console.log('after 62s', await h.sheet())
})
