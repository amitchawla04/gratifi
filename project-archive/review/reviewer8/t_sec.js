const setup = require('./h.js')
;(async () => {
  const H = await setup(process.argv[2] || 'UK', { tag: 'sec-' + (process.argv[2] || 'UK'), q: '&tab=me' })
  const { p, ask, btn, shot, tall, money, lastAnswer, confirmSheet, S, last, nav } = H
  const card = async () => { const s = await S(); return JSON.stringify({ fr: s.card.frozen, on: s.card.online, ab: s.card.abroad, cl: s.card.contactless, atm: s.card.atm, dd: s.card.autopay }) }
  const sheet = async () => p.evaluate(() => document.querySelector('.app-sheet')?.innerText?.replace(/\n/g, ' / ') || null)
  if (!process.env.LATE) {
  await btn('Suspicious payment'); await p.waitForTimeout(300)
  await btn('It was me'); await p.waitForTimeout(300); console.log('it was me -> sheet:', await sheet(), 'card', await card(), 'reply', (await last()).text)
  if (await p.$('.app-sheet')) { await p.keyboard.press('Escape'); await p.waitForTimeout(300); console.log('after esc card', await card()) }
  await ask('unfreeze my card'); console.log('unfreeze sheet:', await sheet()); await shot('unfreeze-sheet')
  // focus trap: tab around
  const f = []; for (let i = 0; i < 6; i++) { await p.keyboard.press('Tab'); f.push(await p.evaluate(() => (document.activeElement?.closest('.app-sheet') ? 'IN:' : 'OUT:') + (document.activeElement?.getAttribute('aria-label') || document.activeElement?.innerText?.slice(0, 20)))) } console.log('tab order', f.join(' | '))
  await confirmSheet(); console.log('after unfreeze', await card(), (await last()).text)
  await ask('turn off online payments'); console.log('off:', (await last()).text, await card())
  await ask('turn on online payments'); console.log('on sheet:', await sheet()); await p.keyboard.press('Escape'); await p.waitForTimeout(200); console.log('after esc', await card())
  // toggle switch directly in controls block
  const sw = lastAnswer().locator('[role=switch]'); console.log('switches', await sw.count())
  await ask('card controls'); const sws = p.locator('.gr-answer').last().locator('[role=switch]'); const n = await sws.count(); console.log('controls switches', n)
  if (n) { await sws.nth(1).click(); await p.waitForTimeout(300); console.log('clicked online switch -> sheet:', await sheet(), await card()); await p.keyboard.press('Escape') }
  // Direct Debit
  await ask('set up a direct debit'); await btn(/Direct Debit/); await p.waitForTimeout(300); console.log('DD sheet:', await sheet()); await p.keyboard.press('Escape'); await p.waitForTimeout(200); console.log('dd after esc', await card())
  }
  await nav(3)
  // pay custom amount
  await ask('what do I owe'); await p.getByRole('radio', { name: /Another amount/ }).last().click(); await p.waitForTimeout(200); const inp = lastAnswer().locator('input'); console.log('amount inputs', await inp.count())
  if (await inp.count()) { await inp.first().fill('10000'); await p.waitForTimeout(200); console.log('pay btn for 10000:', await p.getByRole('button', { name: /^Pay / }).last().innerText(), 'enabled', await p.getByRole('button', { name: /^Pay / }).last().isEnabled()); await inp.first().fill('0.5'); await p.waitForTimeout(200); console.log('pay btn for 0.5:', await p.getByRole('button', { name: /^Pay / }).last().innerText(), await p.getByRole('button', { name: /^Pay / }).last().isEnabled()); await inp.first().fill('55.55'); await tall('custom-amount'); await p.getByRole('button', { name: /^Pay / }).last().click(); await p.waitForTimeout(300); console.log('custom sheet', await sheet()); await confirmSheet(); console.log('paid custom', JSON.stringify(await money())) }
  // subscriptions
  await ask('Start a streaming subscription'); await lastAnswer().locator('.gr-itemrow').first().click(); await p.waitForTimeout(300); await lastAnswer().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(300)
  await tall('sub-checkout'); await btn(/^Pay /); await confirmSheet(); console.log('subscribed', (await last()).text, JSON.stringify(await money()))
  await ask('pause my Screenly'); console.log('pause:', (await last()).text)
  await ask('resume my Screenly'); console.log('resume:', (await last()).text, 'sheet', await sheet()); if (await p.$('.app-sheet')) await confirmSheet(); console.log('resumed:', (await last()).text)
  await ask('cancel my Screenly'); console.log('cancel:', (await last()).text); await btn(/Yes|cancel/i).catch(() => {}); console.log('cancelled:', (await last()).text)
  const s = await S(); console.log('subs', s.bookings.filter(b => b.kind === 'sub').map(b => b.title + ':' + b.status + ':' + b.card + ':' + b.pts).join(' | '))
  await H.done()
})()
