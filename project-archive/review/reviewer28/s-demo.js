module.exports = async (h) => { const { p, nav, say, click, confirm, sheet, state, full, url } = h
  const S = async (l) => { const s = await state(); console.log('STATE', l, 'pts', s.balance, 'card', s.card.balance, 'due', s.card.due, 'frozen', s.card.frozen, (s.bookings||[]).map(b=>b.title+':'+b.status+':'+b.pts+'/'+b.card).join('; ')) }
  await nav(5); await click('Points come in (+5,000)'); await S('pts in'); await click('A card payment'); await S('card pay')
  console.log('ME', (await p.locator('.app-main').innerText()).replace(/\n+/g,' | ').slice(0,600))
  // supplier down
  await p.locator('.app-demo [role=switch]').nth(1).click(); await nav(3)
  await say('Noise-cancelling headphones'); await p.locator('.gr-answer').last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(300)
  await p.locator('.gr-answer').last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(300)
  await p.getByRole('button', { name: /^Pay / }).last().click(); await p.waitForTimeout(300); const t = await confirm(); console.log('SHEET', t)
  console.log('AFTER supplier down:', (await h.last()).slice(0,400)); await S('supplier down')
  await nav(5); await p.locator('.app-demo [role=switch]').nth(1).click(); await nav(3)
  // reload with open checkout, then pay from old button
  await say('Rain shell jacket'); await p.locator('.gr-answer').last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(300); await p.locator('.gr-answer').last().locator('.gr-chip').nth(1).click(); await p.locator('.gr-answer').last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(300)
  await p.reload(); await p.waitForTimeout(800); await nav(3)
  await p.getByRole('button', { name: /^Pay / }).last().click(); await p.waitForTimeout(300); await confirm(); await S('jacket after reload')
  await p.reload(); await p.waitForTimeout(800); await nav(3)
  const pays = await p.getByRole('button', { name: /^Pay / }).count(); console.log('live pay buttons after paid+reload', pays)
  if (pays) { await p.getByRole('button', { name: /^Pay / }).last().click(); await p.waitForTimeout(400); console.log('SHEET2', await sheet()); console.log('LAST', (await h.last()).slice(0,300)) }
  await p.keyboard.press('Escape')
  // demo buttons
  await nav(5); await click('Delay my order'); console.log('DELAY', (await h.last()).slice(0,300))
  await nav(5); await click('Deliver my order'); console.log('DELIVER', (await h.last()).slice(0,300))
  await nav(5); await click('Return window ends'); console.log('RETWIN', (await h.last()).slice(0,300))
  await nav(5); await click('Cancel my next flight'); console.log('CANCELFL', (await h.last()).slice(0,300))
  await nav(5); await click('Suspicious payment'); console.log('SUSP', (await h.last()).slice(0,400)); await S('susp')
  await nav(5); await click('Reset demo'); await p.waitForTimeout(500); await S('reset')
}
