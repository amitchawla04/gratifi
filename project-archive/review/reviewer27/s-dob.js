module.exports = async (h) => { const { p, say, click, confirm, state, nav, full, sheet } = h
  await nav(3); await say('fly to Paris 3rd Nov back on the 7th, two adults and a baby')
  await p.locator('.gr-flight').first().click(); await p.waitForTimeout(500); await click(/Continue with/); await p.waitForTimeout(400)
  const ins = p.locator('.gr-answer').last().locator('input'); const n = await ins.count(); const names = ['Priya Chawla', 'Anya Chawla']; let k = 0
  for (let i = 0; i < n; i++) { const t = await ins.nth(i).getAttribute('type'); if (t === 'date') await ins.nth(i).fill('2024-11-20'); else if (!(await ins.nth(i).inputValue())) await ins.nth(i).fill(names[Math.min(k++, 1)]) }
  await click('Continue', { exact: true }); await click(/^Pay /); await confirm(); console.log('BOOKED', (await h.last()).slice(0, 200))
  await say('change my flight'); await full('chg'); console.log((await h.last()).slice(0, 400))
  // pick return leg tab then a late date
  const back = p.locator('.gr-answer').last().getByRole('tab', { name: /back|return/i }); if (await back.count()) await back.first().click(); else await p.locator('.gr-answer').last().getByText('Flight back').click().catch(() => {}); await p.waitForTimeout(300)
  const slot = p.locator('.gr-answer').last().locator('.gr-slot', { hasText: '25 Nov' }); console.log('slot', await slot.count()); if (await slot.count()) { await slot.first().click(); await p.waitForTimeout(400) } await full('chg2'); console.log('AFTER PICK', (await h.last()).slice(0, 700))
  const b = p.locator('.gr-answer').last().locator('.gr-btn').last(); console.log('btn', await b.innerText(), await b.isDisabled()); await b.click().catch(() => {}); await p.waitForTimeout(500); console.log('NEXT', (await h.last()).slice(0, 600)); const s = await sheet(); console.log('SHEET', s)
  await say('move my return to 25 November'); console.log('TXT', (await h.last()).slice(0, 500))
}
