const C = (l) => l.evaluate(e => e.click())
module.exports = async function book(h, q = 'Flights to Lisbon 16th October to 23rd October 2 adults 1 child', pay = 'card', fare = null) {
  const { p } = h
  await h.nav(3); await h.ask(q)
  await C(p.locator('.gr-flight').first()); await p.waitForTimeout(500)
  if (fare) { await C(h.last().getByText(fare, { exact: true }).first()); await p.waitForTimeout(200) }
  await h.btn(/Continue with/)
  const ins = h.last().locator('input'); const n = await ins.count()
  for (let i = 0; i < n; i++) { const t = await ins.nth(i).getAttribute('type'); const v = await ins.nth(i).inputValue(); if (!v) await ins.nth(i).fill(t === 'date' ? (/Infant/.test(await ins.nth(i - 1).getAttribute('placeholder') || '') ? '2025-06-01' : '2018-05-05') : 'Sam Taylor ' + i) }
  await p.waitForTimeout(200); await h.btn(/^Continue$/)
  const radios = h.last().locator('[role=radio]'); if (pay === 'card') await C(radios.last()); else if (pay === 'mix') await C(radios.nth(1)); else await C(radios.first()); await p.waitForTimeout(200)
  await h.btn(/^Pay /); await h.faceid()
}
module.exports.C = C
