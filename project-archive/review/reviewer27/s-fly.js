module.exports = async (h) => { const { p, say, click, confirm, state, nav, full, sheet } = h
  await nav(3)
  await say('fly to Paris 3rd Nov back on the 7th, two adults and my 1 year old daughter, morning please')
  await full('results')
  await p.locator('.gr-flight').first().click(); await p.waitForTimeout(500); console.log('FARES:', (await h.last()).slice(0, 900)); await full('fares')
  await click(/Continue with/); await p.waitForTimeout(400); await full('pax')
  console.log('PAX CARD:', (await h.last()).slice(0, 1200))
  const ins = p.locator('.gr-answer').last().locator('input'); const n = await ins.count(); const types = []; for (let i = 0; i < n; i++) types.push(await ins.nth(i).getAttribute('type') + ':' + await ins.nth(i).getAttribute('aria-label')); console.log('INPUTS', types.join(' | '))
  const names = ['Priya Chawla', 'Anya Chawla', 'Anya Chawla']; let k = 0
  for (let i = 0; i < n; i++) { const t = await ins.nth(i).getAttribute('type'); if (t === 'date') { await ins.nth(i).fill('2025-06-10'); } else if (!(await ins.nth(i).inputValue())) { await ins.nth(i).fill(names[Math.min(k++,2)]) } }
  await full('filled'); console.log('AFTER FILL:', (await h.last()).slice(-600))
  await click('Continue', { exact: true }).catch(e => console.log('continue fail', e.message.slice(0, 80))); await p.waitForTimeout(400); console.log('CHECKOUT:', (await h.last()).slice(0, 1200)); await full('checkout')
  await click(/^Pay /); console.log('SHEET', await confirm()); console.log('RECEIPT', (await h.last()).slice(0, 900)); await full('receipt')
  for (const q of ['move my return to the 8th', 'change my seats', 'show my boarding pass', 'cancel my flight']) { await say(q); const s = await sheet(); if (s) { console.log('  SHEET:', s.slice(0, 400)); await p.keyboard.press('Escape'); await p.waitForTimeout(300) } await full('m') }
  const st = await state(); console.log('CARD', JSON.stringify(st.card).slice(0,300)); console.log('BOOKINGS', JSON.stringify(st.bookings.map(b => ({ t: b.title, s: b.status, tot: b.total, pts: b.pts, card: b.card, x: b.extra && { date: b.extra.date, back: b.extra.back, dep: b.extra.dep } }))))
}
