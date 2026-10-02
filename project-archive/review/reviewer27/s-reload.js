module.exports = async (h) => { const { p, say, click, confirm, state, nav, full, sheet, shot } = h
  await nav(3); await say('Leather trainers'); await p.locator('.gr-answer').last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(400)
  await p.locator('.gr-answer').last().locator('.gr-chip').nth(2).click(); await p.locator('.gr-answer').last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(400)
  // prepare second checkout (not paid) for fast track
  await click(/^Pay /); await confirm(); console.log('PAID', (await h.last()).slice(0, 200))
  await say('Fast track security'); await p.locator('.gr-answer').last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(400); await p.locator('.gr-answer').last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(400)
  const s0 = await state(); console.log('before reload pts', s0.balance, 'card', s0.card.balance)
  await p.reload(); await p.waitForTimeout(900); await nav(3); await p.waitForTimeout(400)
  const pays = p.getByRole('button', { name: /^Pay / }); const n = await pays.count(); console.log('pay buttons after reload', n, JSON.stringify(await pays.evaluateAll(bs => bs.map(b => [b.textContent, b.disabled, b.getAttribute('aria-disabled')]))))
  for (let i = 0; i < n; i++) { await pays.nth(i).click({ timeout: 1500 }).catch(e => console.log('click', i, 'fail')); await p.waitForTimeout(500); const s = await sheet(); console.log('SHEET', i, s && s.slice(0, 200)); if (s) { await confirm(); console.log('->', (await h.last()).slice(0, 300)) } }
  const s1 = await state(); console.log('after pts', s1.balance, 'card', s1.card.balance, s1.bookings.map(b => b.title + ':' + b.status).join('; '))
  await full('end')
}
