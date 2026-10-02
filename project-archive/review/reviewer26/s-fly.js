module.exports = async (h) => { const { p, say, click, confirm, state, nav, full, sheet } = h
  await nav(3)
  await say('flights to Barcelona on 16 Oct back 20 Oct for me, my wife, our son who is 7 and our baby')
  await full('fam-results')
  await p.locator('.gr-flight').first().click(); await p.waitForTimeout(500); console.log('FARES:', (await h.last()).slice(0, 700))
  await click(/Continue with/); await p.waitForTimeout(400); await full('fam-pax')
  console.log('PAX CARD:', (await h.last()).slice(0, 900))
  const ins = p.locator('.gr-answer').last().locator('input'); const n = await ins.count(); const types = []; for (let i = 0; i < n; i++) types.push(await ins.nth(i).getAttribute('type') + ':' + await ins.nth(i).getAttribute('placeholder') + ':' + await ins.nth(i).getAttribute('aria-label')); console.log('INPUTS', types.join(' | '))
  // fill names; one non-Latin
  const names = ['Amit Chawla', 'Priya Chawla', 'Rohan Chawla', 'Anya Chawla']; let k = 0
  for (let i = 0; i < n; i++) { const t = await ins.nth(i).getAttribute('type'); if (t === 'date') { await ins.nth(i).fill(k === 5 ? '2025-06-10' : '2019-05-01'); } else if (!(await ins.nth(i).inputValue())) { await ins.nth(i).fill(names[[0,1,2,2,3,3][k]]) } k++ }
  await full('fam-filled'); console.log('AFTER FILL:', (await h.last()).slice(-500))
  await click('Continue', { exact: true }).catch(e => console.log('continue fail', e.message.slice(0, 80))); await p.waitForTimeout(400); console.log('CHECKOUT:', (await h.last()).slice(0, 900)); await full('fam-checkout')

  await click(/^Pay /); console.log('SHEET', await confirm()); console.log('RECEIPT', (await h.last()).slice(0, 700))
  for (const q of ['change my return flight to the 21st', 'actually move the outbound to later that day', 'can I move my return to the Aurora Air flight', 'change my seats', 'show my boarding pass', 'cancel my flight']) { await say(q); const s = await sheet(); if (s) { console.log('  SHEET:', s.slice(0, 300)); await p.keyboard.press('Escape'); await p.waitForTimeout(300) } }
  await full('manage-end')
  const st = await state(); console.log('BOOKINGS', JSON.stringify(st.bookings.map(b => ({ t: b.title, s: b.status, tot: b.total, pts: b.pts, card: b.card, x: b.extra && { date: b.extra.date, back: b.extra.back, dep: b.extra.dep } }))))
}
