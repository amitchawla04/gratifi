module.exports = async (h) => { const { p, say, click, confirm, state, nav, full, sheet } = h
  await nav(3); await say('13-inch laptop'); await p.locator('.gr-answer').last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(400)
  const plus = p.locator('.gr-answer').last().locator('button[aria-label*="ncrease"], button[aria-label*="More"], button[aria-label*="Add one"]'); for (let i = 0; i < 7; i++) await plus.last().click().catch(() => {})
  await p.locator('.gr-answer').last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(400); await p.locator('.gr-answer').last().getByText('Card', { exact: true }).click().catch(() => {});
  await p.getByRole('button', { name: /^Pay / }).last().click(); await p.waitForTimeout(700); console.log('SHEET', await sheet()); await full('after-pay'); console.log((await h.last()).slice(0, 600))
  // points and card path
  await say('13-inch laptop'); await p.locator('.gr-answer').last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(400)
  const plus2 = p.locator('.gr-answer').last().locator('button[aria-label*="ncrease"], button[aria-label*="More"], button[aria-label*="Add one"]'); for (let i = 0; i < 6; i++) await plus2.last().click().catch(() => {})
  await p.locator('.gr-answer').last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(400); await p.locator('.gr-answer').last().getByText('Points and card', { exact: true }).click().catch(() => {});
  console.log((await h.last()).slice(0, 700)); await p.getByRole('button', { name: /^Pay / }).last().click(); await p.waitForTimeout(700); const s = await sheet(); console.log('SHEET2', s); if (s) { await confirm(); } await full('after-pay2'); console.log((await h.last()).slice(0, 600)); const st = await state(); console.log('card', st.card.balance, 'pts', st.balance)
}
