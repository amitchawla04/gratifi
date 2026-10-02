const setup = require('./h.js')
;(async () => {
  const H = await setup('UK', { tag: 'man', q: '&tab=chat' })
  const { p, ask, btn, shot, tall, money, lastAnswer, confirmSheet, S, last, nav } = H
  const log = async (l) => console.log(l, JSON.stringify(await money()))
  await ask('Ways to earn more'); await btn('Join'); // joins first Join = CHL-2? check
  let s = await S(); console.log('challenges', s.challenges.map(c => c.id + ':' + c.joined + ':' + c.progress + '/' + c.target).join(' '))
  await log('start')
  // buy headphones on card
  await ask('Noise-cancelling headphones'); await lastAnswer().locator('.gr-itemrow').first().click(); await p.waitForTimeout(300)
  await lastAnswer().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(300)
  await p.getByRole('radio', { name: /^Card/ }).last().click(); await btn(/^Pay /); await confirmSheet()
  await log('after card buy'); s = await S(); console.log('challenges', s.challenges.map(c => c.id + ':' + c.joined + ':' + c.progress + '/' + c.target + ':' + !!c.done).join(' ')); console.log('ledger', s.ledger.slice(0, 4).map(l => l.label + ' ' + l.pts).join(' | '))
  await shot('receipt', true)
  // re-tap old Pay button (scroll up)
  const oldPay = p.getByRole('button', { name: /^Pay / }); console.log('old pay buttons', await oldPay.count(), 'disabled?', await oldPay.last().isDisabled().catch(() => 'n/a'))
  if (await oldPay.count()) { await oldPay.last().scrollIntoViewIfNeeded(); await oldPay.last().click({ force: true }).catch(e => console.log('click fail', e.message.slice(0, 80))); await p.waitForTimeout(500); console.log('sheet after old pay?', !!(await p.$('.app-sheet'))); const r = await last(); console.log('reply', r.text) ; await p.keyboard.press('Escape') }
  // cancel via chat
  await ask('cancel my headphones'); await shot('cancel-ask', true); console.log('ask', (await last()).text)
  await btn('Yes, cancel'); await shot('cancelled', true); console.log('cancel reply', (await last()).text)
  await log('after cancel'); s = await S(); console.log('challenges', s.challenges.map(c => c.id + ':' + c.progress + ':' + !!c.done).join(' ')); console.log('ledger', s.ledger.slice(0, 6).map(l => l.label + ' ' + l.pts).join(' | ')); console.log('txn0', JSON.stringify(s.txns[0]))
  // cancel again through old button and through chat
  const yes = p.getByRole('button', { name: 'Yes, cancel' }); console.log('yes buttons', await yes.count(), 'enabled', await yes.last().isEnabled().catch(() => 'n/a'))
  await ask('cancel my headphones'); console.log('cancel again:', (await last()).text)
  await log('after 2nd cancel')
  // reload and re-tap everything
  await p.reload(); await p.waitForTimeout(700)
  const btns = await p.$$eval('.gr-answer button:not([disabled])', xs => xs.map(x => x.innerText.trim()).filter(Boolean))
  console.log('enabled buttons after reload', JSON.stringify(btns).slice(0, 800))
  await H.done()
})()
