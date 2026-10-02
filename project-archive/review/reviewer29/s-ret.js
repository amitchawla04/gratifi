module.exports = async (h) => { const { p, nav, say, click, confirm, state, sheet, last } = h
  const S = async (l) => { const s = await state(); console.log('STATE', l, 'pts', s.balance, 'card', s.card.balance, (s.bookings||[]).map(b=>b.title+':'+b.status+':'+b.pts+'/'+b.card).join('; ')) }
  await nav(3); await say('Noise-cancelling headphones'); await p.locator('.gr-answer').last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(300)
  await p.locator('.gr-answer').last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(300)
  await p.locator('.gr-answer').last().getByText('Points and card', { exact: true }).click(); await p.waitForTimeout(200)
  await click(/^Pay /); await confirm(); await S('bought')
  await nav(5); await click('Deliver my order'); await nav(3)
  await say('return my headphones'); console.log('RET', (await last()).slice(0,500)); const b = p.getByRole('button', { name: /return|Yes/i }); 
  const btns = await p.locator('.gr-answer').last().locator('.gr-btn').allInnerTexts(); console.log('BTNS', btns)
  await p.locator('.gr-answer').last().locator('.gr-btn').first().click(); await p.waitForTimeout(500); if (await sheet()) await confirm(); console.log('RET2', (await last()).slice(0,500)); await S('return started')
  await p.reload(); await p.waitForTimeout(34000); await S('after 34s+reload'); await nav(3); console.log('LAST', (await last()).slice(0,400))
}
