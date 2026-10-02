module.exports = async (h) => { const { p, nav, say, sheet, state, shot } = h
  await nav(3); await say('A gift card for a friend'); await p.locator('.gr-answer').last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(300)
  await p.locator('.app-in').nth(0).fill('Sam'); await p.locator('.app-in').nth(1).fill('sam@example.com'); await p.locator('.gr-answer').last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(300)
  await p.getByRole('button', { name: /^Pay / }).last().click(); await p.waitForTimeout(400); console.log('SHEET', await sheet()); await shot('my-sheet')
  await p.locator('.app-sheet .gr-btn').last().click(); await p.waitForTimeout(600); console.log('SHEET2', await sheet()); await shot('my-sheet2'); await p.waitForTimeout(4000); console.log('SHEET3', await sheet()); console.log(await h.last())
}
