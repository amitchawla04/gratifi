module.exports = async (h) => {
  const { say, log, lastAnswer, full, click, confirm, st, sheet, p, nav, url } = h
  const S = async (l) => { const s = await st(); log(`  [${l}] pts=${s.balance} card.bal=${s.card.balance} due=${s.card.due} min=${s.card.min} avail=${s.card.limit - s.card.balance} bookings=${JSON.stringify(s.bookings.map(b => [b.title.slice(0, 20), b.status, b.total, b.pts, b.card, b.earned]))}`) }
  const pickCard = async () => { const a = p.locator('.gr-answer').last(); const o = a.getByRole('radio', { name: /^Card/ }); if (await o.count()) { await o.last().click() } else { await a.getByText(/^Card$/).last().click() } await p.waitForTimeout(250) }
  const buy = async (q, pre) => { await say(q); await p.locator('.gr-answer').last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(400); if (pre) await pre(); await p.locator('.gr-answer').last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(400) }
  //start
  await say('hello')
  // pay bill part, check min
  await say('pay £10 off my bill'); log('  ' + (await lastAnswer()).slice(0, 300)); await click(/^Pay /).catch(() => { }); log('  SHEET: ' + await sheet()); await confirm(); await S('after £10')
  await say('what do I owe'); log('  ' + (await lastAnswer()).slice(0, 300))
  await say('pay £20 off my bill'); await click(/^Pay /).catch(() => { }); await confirm(); await S('after £30 total')
  await say('what do I owe'); log('  ' + (await lastAnswer()).slice(0, 300))
  // reload and old buttons
  await p.reload(); await p.waitForTimeout(800); await nav(3)
  const old = await p.getByRole('button', { name: /^Pay / }).count(); log('  old Pay buttons live after reload: ' + old)
  const en = []; for (const b of await p.getByRole('button', { name: /^Pay |Yes, cancel|Book|Continue/ }).all()) { if (await b.isEnabled() && await b.isVisible()) en.push(await b.innerText()) } log('  enabled after reload: ' + JSON.stringify(en))
  await full('reload')
}
