module.exports = async (h) => { const { p, say, click, confirm, state, nav } = h
  await nav(3); await say('Noise-cancelling headphones'); await p.locator('.gr-answer').last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(400)
  await p.locator('.gr-answer').last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(400); await p.locator('.gr-answer').last().getByText('Card', { exact: true }).click(); await click(/^Pay /); await confirm()
  let s = await state(); console.log('pts after buy', s.balance)
  // spend points: laptop with points & card mix max
  await say('13-inch laptop'); await p.locator('.gr-answer').last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(400); await p.locator('.gr-answer').last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(400)
  await p.locator('.gr-answer').last().getByText('Points and card', { exact: true }).click(); await p.waitForTimeout(300); console.log('LAPTOP', (await h.last()).slice(-300)); await click(/^Pay /); await confirm()
  s = await state(); console.log('pts after laptop', s.balance, 'card', s.card.balance)
  await say('cancel my headphones'); await h.full('writeoff-ask'); await click('Yes, cancel'); console.log('->', (await h.last()).slice(0, 500)); s = await state(); console.log('pts end', s.balance, 'card', s.card.balance)
}
