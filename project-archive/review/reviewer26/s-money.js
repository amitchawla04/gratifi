module.exports = async (h) => { const { p, say, click, confirm, state, nav, full, sheet } = h
  const S = async (tag) => { const s = await state(); if (!s || !s.card) return; console.log(`STATE[${tag}] cardBal=${s.card.balance} due=${s.card.due} min=${s.card.min} limit=${s.card.limit} pts=${s.balance} | ` + (s.bookings || []).map(b => `${b.title}:${b.status}:tot${b.total}:pts${b.pts}:card${b.card}:earn${b.earned}`).join('; ')) }
  await S('start'); await nav(3)
  // buy headphones with card only
  await say('Noise-cancelling headphones'); await p.locator('.gr-answer').last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(400)
  await p.locator('.gr-answer').last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(400)
  await p.locator('.gr-answer').last().getByText('Card', { exact: true }).click(); await p.waitForTimeout(300)
  console.log('CHECKOUT:', (await h.last()).slice(0, 500))
  await click(/^Pay /); console.log('SHEET:', await confirm()); console.log('RECEIPT:', (await h.last()).slice(0, 500)); await S('after card buy')
  // old pay button
  const old = p.getByRole('button', { name: /^Pay / }); console.log('old pay buttons enabled:', await old.count(), await old.evaluateAll(bs => bs.map(b => b.disabled || b.getAttribute('aria-disabled'))))
  // cancel it
  await say('cancel my headphones'); await click('Yes, cancel'); console.log('CANCELLED:', (await h.last()).slice(0, 400)); await S('after cancel')
  // points-mix stay then cancel
  await say('A hotel in Lisbon with a pool'); await p.locator('.gr-answer').last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(400)
  await p.locator('.gr-answer').last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(400)
  await p.locator('.gr-answer').last().getByText('Points and card', { exact: true }).click(); await p.waitForTimeout(300)
  console.log('STAY CHECKOUT:', (await h.last()).slice(0, 600)); await click(/^Pay /); console.log('SHEET:', await confirm()); console.log('RECEIPT:', (await h.last()).slice(0, 600)); await S('after stay')
  await say('cancel my hotel'); const yes = p.getByRole('button', { name: /Yes, cancel/ }); if (await yes.count()) { await yes.last().click(); await p.waitForTimeout(500) } else { const s = await sheet(); console.log('CANCEL SHEET', s); if (s) await confirm() } console.log('STAY CANCELLED:', (await h.last()).slice(0, 500)); await S('after stay cancel')
  // supplier down
  await nav(5); await p.getByText('Supplier is down').locator('xpath=..').locator('[role=switch], button').first().click().catch(async () => { await p.locator('.app-demo [role=switch]').nth(1).click() }); await nav(3)
  await say('Leather trainers'); await p.locator('.gr-answer').last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(400); await p.locator('.gr-answer').last().locator('.gr-chip').filter({ hasText: /^(8|9|10|42|43)$/ }).first().click().catch(() => {}); console.log('TRAINER DETAIL:', (await h.last()).slice(-300))
  await p.locator('.gr-answer').last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(400); await click(/^Pay /); const sh = await sheet(); console.log('SD sheet', sh && sh.slice(0, 200)); if (sh) await confirm(); console.log('SUPPLIER DOWN RESULT:', (await h.last()).slice(0, 500)); await S('after supplier down')
  await full('supplier-down')
}
