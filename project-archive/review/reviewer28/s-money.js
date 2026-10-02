module.exports = async (h) => { const { p, nav, say, click, confirm, state, sheet } = h
  const S = async (l) => { const s = await state(); console.log('STATE', l, 'pts', s.balance, 'card', s.card.balance, (s.bookings||[]).map(b=>b.title+':'+b.status+':'+b.pts+'/'+b.card).join('; ')) }
  await nav(3)
  const buy = async (q, method) => { await say(q); await p.locator('.gr-answer').last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(300); const b = p.locator('.gr-answer').last().locator('.gr-detail .gr-btn').last(); if (/Pick a size/.test(await b.innerText())) { await p.locator('.gr-answer').last().locator('.gr-chip').nth(1).click() } await b.click(); await p.waitForTimeout(300); if (method) { await p.locator('.gr-answer').last().getByText(method, { exact: true }).click(); await p.waitForTimeout(200) } await p.getByRole('button', { name: /^Pay / }).last().click(); const t = await confirm(); console.log('SHEET', (t||'').slice(0,200)) }
  await buy('13-inch laptop', 'Card'); await S('laptop by card')
  await say('Transfer points to miles'); await p.locator('.gr-ack input').first().check().catch(() => {}); await p.locator('.gr-answer').last().locator('.gr-btn').first().click(); await p.waitForTimeout(400)
  console.log('XFER CARD', (await h.last()).slice(0,500))
  // spend almost all points
  await say('Donate 48000 points to charity'); console.log((await h.last()).slice(0,300)); const sh = await sheet(); if (sh) { console.log('DON SHEET', sh.slice(0,200)); await confirm() } else { await p.locator('.gr-answer').last().locator('.gr-btn').first().click().catch(()=>{}); await p.waitForTimeout(300); if (await sheet()) await confirm() }
  await S('after donate')
  await say('cancel my laptop'); await S('cancel ask'); const cb = p.getByRole('button', { name: 'Yes, cancel' }); if (await cb.count()) { await cb.last().click(); await p.waitForTimeout(500); if (await sheet()) await confirm() }
  console.log('CANCEL MSG', (await h.last()).slice(0,500)); await S('after cancel')
  // credit limit: set big card purchase over available
  await nav(5); for (let i=0;i<3;i++) { } await nav(3)
  await say('lower my credit limit to £1000'); if (await sheet()) await confirm(); await S('limit lowered')
  await buy('13-inch laptop', 'Card'); console.log('OVER LIMIT', (await h.last()).slice(0,400)); await S('over limit')
}
