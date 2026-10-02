module.exports = async (h) => { const { p, say, click, confirm, state, nav, full, sheet, shot } = h
  const S = async (t) => { const s = await state(); if (!s || !s.card) return console.log(t, 'none'); console.log('STATE', t, 'pts', s.balance, 'card', s.card.balance, 'due', s.card.due, s.bookings.map(b => b.title + ':' + b.status).join('; ')) }
  await nav(5); for (const b of ['Points come in (+5,000)', 'A card payment']) { await click(b); await p.waitForTimeout(500); await S(b) }
  await shot('me-after'); await nav(1); await full('home-after'); await nav(3); await full('chat-after')
  await say('where did my money go?'); await full('spend')
  await say('what do I owe?')
  // order then delay/deliver/return window
  await say('Air fryer'); await p.locator('.gr-answer').last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(400); await p.locator('.gr-answer').last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(400); await click(/^Pay /); await confirm()
  await nav(5); await click('Delay my order'); await nav(3); await full('delay'); await nav(5); await click('Deliver my order'); await nav(3); await full('delivered')
  await say('return my air fryer'); await full('return-ask'); const b = p.locator('.gr-answer').last().locator('.gr-btn').last(); console.log('return btn', await b.innerText().catch(() => '')); await b.click().catch(() => {}); await p.waitForTimeout(500); const s = await sheet(); if (s) { console.log('RET SHEET', s); await confirm() } await full('return-started'); await S('return')
  await p.waitForTimeout(33000); await nav(4); await nav(3); await full('after-30s'); await S('after 30s')
  await nav(5); await click('Return window ends'); await nav(3); await full('window'); await say('return my air fryer')
  await nav(5); await click('Suspicious payment'); await full('susp'); await nav(3); await full('susp-chat')
  await nav(5); await click('Reset demo'); await p.waitForTimeout(500); await S('reset'); await full('reset')
}
