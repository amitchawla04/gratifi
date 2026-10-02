module.exports = (H) => {
  const { p, ask, click, last, st, lastMsg, confirm, waitSheetGone, full } = H
  const snap = async () => { const s = await st(); return { bal: s.balance, card: s.card.balance, nb: s.bookings.length, lounge: s.loungeLeft } }
  const diff = (a, b) => `pts ${b.bal - a.bal}, card ${(b.card - a.card).toFixed(2)}, bookings ${b.nb - a.nb}, lounge ${b.lounge - a.lounge}`
  const payIt = async (method) => {
    if (method) { await last().getByText(method, { exact: true }).click().catch(() => console.log('  no method ' + method)); await p.waitForTimeout(250) }
    const pay = p.getByRole('button', { name: /^(Pay |ادفع )/ }).last()
    if (await pay.count()) { const t = await pay.innerText(); await pay.click(); await p.waitForTimeout(300); const sh = await H.sheetText(); await confirm(); await waitSheetGone(); return 'PAID ' + t + ' || SHEET: ' + sh }
    const free = last().locator('.gr-card .gr-btn').last(); const t = await free.innerText(); await free.click(); await p.waitForTimeout(500); return 'FREE ' + t
  }
  const pickFirst = async (nth = 0) => { await last().locator('.gr-itemrow').nth(nth).click(); await p.waitForTimeout(400) }
  const cta = async () => { const c = last().locator('.gr-detail .gr-btn').last(); await c.scrollIntoViewIfNeeded(); const t = await c.innerText(); await c.click(); await p.waitForTimeout(450); return t }
  const log = async (label) => { const m = await lastMsg(); console.log(`[${label}]`, JSON.stringify(m.text), m.kinds.join(',')) }
  return { snap, diff, payIt, pickFirst, cta, log }
}
