const base = require('./s-fly.js')
module.exports = async (h) => { const { p, click, full, confirm, state } = h
  await base(h)
  const card = p.locator('.gr-answer').last()
  const ins = card.locator('input'); const n = await ins.count(); const desc = []
  for (let i = 0; i < n; i++) desc.push(await ins.nth(i).evaluate(e => `${e.type}|${e.getAttribute('aria-label')||e.placeholder||''}|${e.value}`))
  console.log('INPUTS', desc)
  const setVal = async (i, v) => { await ins.nth(i).fill(v); await ins.nth(i).blur() }
  // fill names
  const txtIdx = [], dateIdx = []; for (let i = 0; i < n; i++) (desc[i].startsWith('date') ? dateIdx : txtIdx).push(i)
  for (const i of txtIdx) if (!(await ins.nth(i).inputValue())) await setVal(i, 'Sam Taylor')
  await setVal(dateIdx[0], '2010-01-01') // child 16 -> too old
  await setVal(dateIdx[1], '2024-12-01') // infant 22 months at depart, >2 at return? 
  await p.waitForTimeout(300); console.log('AFTER BAD', (await card.innerText()).replace(/\n+/g,' | ').slice(0, 900))
  const b = card.locator('.gr-btn').last(); console.log('BTN', await b.innerText(), await b.isEnabled())
  await b.click().catch(e=>console.log('click fail')); await p.waitForTimeout(500); console.log('LAST', (await h.last()).slice(0, 500))
  await setVal(dateIdx[0], '2019-03-01'); await setVal(dateIdx[1], '2025-06-01'); await p.waitForTimeout(300)
  await p.locator('.gr-answer').last().locator('.gr-btn').last().click(); await p.waitForTimeout(600); console.log('LAST2', (await h.last()).slice(0, 700))
  await full('checkout-fam')
  // non latin name
}
