module.exports = async (h) => { const { p, say, click, state, nav, sheet, confirm } = h
  await nav(3); await say('A gift card for a friend'); await p.locator('.gr-answer').last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(400)
  const ins = p.locator('.gr-answer').last().locator('.app-in'); await ins.nth(0).fill('Siti'); await ins.nth(1).fill('siti@example.my'); await h.full('gift-detail')
  await p.locator('.gr-answer').last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(400); console.log('CHECKOUT', (await h.last()).slice(0, 600)); await click(/^Pay /); await p.waitForTimeout(400); console.log('SHEET', await sheet()); await h.shot('my-sheet')
  await p.locator('.app-sheet .gr-btn').last().click(); await p.waitForTimeout(3500); console.log('SHEET2', await sheet()); await h.shot('my-approve'); await p.waitForTimeout(3000); console.log('AFTER', (await h.last()).slice(0, 500)); await h.full('my-done')
}
