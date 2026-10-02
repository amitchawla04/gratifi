const H = require('./h.js')
H.run(async (h) => {
  const { p, ask, click, full, shot, confirm, money, log, sheet, nav } = h
  await nav(3)
  await ask('flights to lisbon for me and my baby'); await p.locator('.gr-flight').first().click(); await p.waitForTimeout(400); await full('baby-fares')
  await click(/Continue with/); await full('baby-seats')
  const ins = p.locator('.gr-answer').last().locator('input'); const n = await ins.count(); log('inputs', n)
  for (let i = 0; i < n; i++) log(i, await ins.nth(i).getAttribute('type'), await ins.nth(i).getAttribute('placeholder'), await ins.nth(i).getAttribute('aria-label'))
  await ask('flights to lisbon on 20 Oct for 1 adult and 1 child aged 7 and an infant'); await p.locator('.gr-flight').first().click(); await p.waitForTimeout(400); await click(/Continue with/); await full('fam-seats')
  const ins2 = p.locator('.gr-answer').last().locator('input'); const n2 = await ins2.count(); log('inputs2', n2)
  for (let i = 0; i < n2; i++) log(i, await ins2.nth(i).getAttribute('type'), await ins2.nth(i).getAttribute('placeholder'), await ins2.nth(i).getAttribute('aria-label'))
  // fill names with non-latin and DOBs wrong
  const names = ['Amit Chawla', 'José Müller', 'Baby Chawla']
  let ni = 0
  for (let i = 0; i < n2; i++) { const t = await ins2.nth(i).getAttribute('type'); if (t === 'date') { await ins2.nth(i).fill(i < 3 ? '2023-01-01' : '2021-01-01') } else if (!(await ins2.nth(i).inputValue())) { await ins2.nth(i).fill(names[++ni] || 'X Y') } }
  await p.waitForTimeout(300); await full('fam-filled'); log('btn', await p.locator('.gr-answer').last().locator('.gr-btn').last().innerText())
}, { m: 'UK', tag: 'kids' })
