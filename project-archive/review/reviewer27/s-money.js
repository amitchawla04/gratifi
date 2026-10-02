module.exports = async (h) => { const { p, say, click, confirm, state, nav, full, sheet } = h
  const S = async (tag) => { const s = await state(); if (!s || !s.card) { console.log('STATE['+tag+'] none'); return } console.log(`STATE[${tag}] cardBal=${s.card.balance} due=${s.card.due} min=${s.card.min} pts=${s.balance} | ` + (s.bookings || []).map(b => `${b.title}:${b.status}:tot${b.total}:pts${b.pts}:card${b.card}:earn${b.earned}`).join('; ')) }
  const buy = async (q, pay, pre) => { await say(q); await p.locator('.gr-answer').last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(400); if (pre) await pre(); await p.locator('.gr-answer').last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(400); if (pay) { await p.locator('.gr-answer').last().getByText(pay, { exact: true }).click(); await p.waitForTimeout(300) } console.log('CHECKOUT:', (await h.last()).slice(0, 600)); await click(/^Pay /); const s = await sheet(); console.log('SHEET:', s && s.slice(0,300)); if (s) await confirm(); console.log('RESULT:', (await h.last()).slice(0, 500)) }
  await S('start'); await nav(3)
  await buy('an espresso machine', 'Card'); await S('after espresso card')
  await say('what do I owe?'); await say('pay £300 off my card'); console.log('SHEET', await confirm()); await S('after £300'); await say('what do I owe?')
  await say('pay the minimum'); await full('min')
  // spend points so earned can't come back
  await buy('Use my expiring points on a gift card', 'Points', async () => { const ins = p.locator('.gr-answer').last().locator('input.app-in'); if (await ins.count()) { await ins.nth(0).fill('Sam'); await ins.nth(1).fill('sam@example.com') } const c = p.locator('.gr-answer').last().locator('.gr-chip', { hasText: '£200' }); if (await c.count()) await c.first().click() })
  await S('after gift')
  await buy('13-inch laptop', 'Points and card', async () => { }); await S('after laptop pts')
  await say('cancel my espresso machine'); await full('writeoff-ask'); const y = p.getByRole('button', { name: 'Yes, cancel' }); if (await y.count()) { await y.last().click(); await p.waitForTimeout(500) } console.log('CANCEL:', (await h.last()).slice(0, 600)); await S('after cancel'); await full('writeoff')
  // over limit
  await say('13-inch laptop'); await p.locator('.gr-answer').last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(400)
  const plus = p.locator('.gr-answer').last().locator('button[aria-label*="ncrease"], button[aria-label*="More"], button[aria-label*="Add one"]'); console.log('plus count', await plus.count()); for (let i = 0; i < 7; i++) await plus.last().click().catch(() => {})
  await p.locator('.gr-answer').last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(400); await p.locator('.gr-answer').last().getByText('Card', { exact: true }).click().catch(() => {}); await p.waitForTimeout(300); console.log('OVERLIMIT CHECKOUT:', (await h.last()).slice(0, 700)); await full('overlimit')
  const pb = p.getByRole('button', { name: /^Pay / }).last(); console.log('pay disabled?', await pb.isDisabled().catch(() => 'none')); await pb.click({ timeout: 2000 }).catch(() => {}); await p.waitForTimeout(400); const s2 = await sheet(); console.log('OVERLIMIT SHEET', s2); if (s2) { await confirm(); console.log('->', (await h.last()).slice(0, 400)) } await S('after overlimit')
}
