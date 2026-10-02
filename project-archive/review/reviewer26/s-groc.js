module.exports = async (h) => { const { p, say, click, confirm, state, nav, full } = h
  await nav(3); await say('2 milk and eggs'); await say('add 2 more milk')
  await full('basket'); await click('Checkout'); await click(/^Pay /); await confirm(); console.log('PAID', (await h.last()).slice(0, 400))
  await nav(5); await click('Deliver my order'); await nav(3)
  await say('the eggs were broken'); await click('Report a problem'); console.log('RP ->', (await h.last()).slice(0,500)); await full('claim'); await click('Something arrived damaged'); console.log('DMG ->', (await h.last()).slice(0,600)); await full('dmg'); const cb = p.locator('.gr-answer').last().locator('input[type=checkbox], [role=checkbox]'); console.log('checkboxes', await cb.count())
  if (await cb.count()) { await cb.first().click(); } else { await p.locator('.gr-answer').last().getByRole('button', { name: /eggs/i }).first().click().catch(e=>console.log('noegg')) } await click(/Send claim|Claim/).catch(e => console.log('claim btn', e.message.slice(0, 60))); console.log('CLAIM ->', (await h.last()).slice(0, 400))
  console.log('BAL now', JSON.stringify((await state()).balance)); await p.waitForTimeout(2000); const s = await state(); console.log('after 42s', s.bookings.map(b => b.title + ':' + b.status + ':' + b.total).join('; '), 'pts', s.balance, 'card', s.card.balance); await nav(4); await click('Orders').catch(() => {}); await full('wallet-orders')
}
