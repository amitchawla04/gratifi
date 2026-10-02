module.exports = async (h) => { const { p, nav, say, click, confirm, state, sheet, full, last } = h
  const S = async (l) => { const s = await state(); console.log('STATE', l, 'pts', s.balance, 'card', s.card.balance, (s.bookings||[]).map(b=>b.title+':'+b.status+':'+b.pts+'/'+b.card+':'+(b.extra?.date||'')+' '+(b.extra?.dep||'')).join('; ')) }
  await nav(3); await say('Flights to Lisbon on 16 October, back on the 20th, for two', 900)
  await p.locator('.gr-flight').first().click(); await p.waitForTimeout(400); await click(/Continue with/)
  { const ins = p.locator('.gr-answer').last().locator('input.app-in'); for (let i = 0; i < await ins.count(); i++) { if (!(await ins.nth(i).inputValue())) await ins.nth(i).fill('Sam Taylor') } }
  await click('Continue', { exact: true }); await p.locator('.gr-answer').last().getByText('Card', { exact: true }).click(); await p.waitForTimeout(200); await click(/^Pay /); await confirm(); await S('booked')
  console.log('RECEIPT', (await last()).slice(0, 600))
  await say('change my return flight to the 21st', 900); await full('chg-ret'); console.log('SHEET?', await sheet())
  const mv = p.locator('.gr-answer').last().locator('.gr-btn').first(); 
  await say('can I come back later on the 20th instead', 900); await full('later-ret')
  await say('change my seats', 900); await full('seats')
  await say('add a checked bag to my flight', 900); await full('bag')
  await say('cancel my flight', 900); await full('cancel-ask')
  const yes = p.getByRole('button', { name: /Yes, cancel/ }); if (await yes.count()) { await yes.last().click(); await p.waitForTimeout(500); if (await sheet()) console.log('CANCEL SHEET', await sheet()), await confirm() }
  console.log('CANCELLED', (await last()).slice(0, 600)); await S('after cancel')
  await say('show my bookings', 900); await full('bookings')
}
