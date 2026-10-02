exports.bookFlight = async (h, q = 'Flights to Lisbon 16 Oct back 20 Oct for 2', names = ['Priya Chawla', 'Anya Chawla', 'Ravi Chawla'], payMode) => {
  const { p, ask, btn, confirm, last } = h
  await ask(q); await p.locator('.gr-flight').first().click(); await p.waitForTimeout(500)
  await btn(/Continue with/)
  const ins = last().locator('input.app-in'); const n = await ins.count(); let k = 0
  for (let i = 0; i < n; i++) { if (!(await ins.nth(i).inputValue())) await ins.nth(i).fill(names[k++]) }
  await btn('Continue', { exact: true })
  if (payMode) await last().getByText(payMode, { exact: true }).click()
  await btn(/^Pay /); return await confirm()
}
exports.summ = async (h) => { const s = await h.st(); return { bal: s.card.balance, pts: s.balance, bookings: s.bookings.map(b => [b.ref, b.title, b.status, b.total, b.pts, b.card, b.refunded && JSON.stringify(b.refunded), b.earned]), ledger: s.ledger.slice(0, 6).map(l => l.label + ' ' + l.pts), txns: s.txns.slice(0, 5).map(t => t.merchant + ' ' + t.amount + (t.refund ? ' R' : '') + (t.pending ? ' P' : '')) } }
