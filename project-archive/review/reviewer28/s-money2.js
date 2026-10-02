module.exports = async (h) => { const { p, nav, say, confirm, state, sheet } = h
  const S = async (l) => { const s = await state(); console.log('STATE', l, 'pts', s.balance, 'card', s.card.balance, 'limit', s.card.limit, (s.bookings||[]).map(b=>b.title+':'+b.status+':'+b.pts+'/'+b.card).join('; ')) }
  await nav(3)
  const toCheckout = async (q) => { await say(q); await p.locator('.gr-answer').last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(300); await p.locator('.gr-answer').last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(300) }
  await toCheckout('13-inch laptop'); await p.locator('.gr-answer').last().getByText('Card', { exact: true }).click(); await p.getByRole('button', { name: /^Pay / }).last().click(); await confirm(); await S('laptop')
  for (const n of ['48000', '1000']) { await say(`Donate ${n} points to charity`); await p.locator('.gr-answer').last().getByRole('button', { name: 'Give points' }).first().click(); await p.waitForTimeout(300); if (await sheet()) await confirm() }
  await S('after donate')
  await say('cancel my laptop'); await p.getByRole('button', { name: 'Yes, cancel' }).last().click(); await p.waitForTimeout(500); if (await sheet()) await confirm()
  console.log('CANCEL MSG', (await h.last()).slice(0,500)); await S('after cancel')
  await say('lower my credit limit to £1000'); if (await sheet()) await confirm(); await S('limit')
  await toCheckout('13-inch laptop'); console.log('CHECKOUT', (await h.last()).slice(0, 600))
  const pb = p.getByRole('button', { name: /^Pay / }).last(); console.log('pay enabled?', await pb.isEnabled().catch(()=>'none'))
  await p.locator('.gr-answer').last().getByText('Card', { exact: true }).click().catch(e=>console.log('no card opt')); await p.waitForTimeout(300); console.log('CHECKOUT2', (await h.last()).slice(0, 700))
}
