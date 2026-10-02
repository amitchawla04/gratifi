require('./h.js')('UK', async (h) => {
  const { p, ask, click, full, confirm, nav, st, log, ans, shot, sheet } = h
  await nav(3)
  await ask('where did my money go?')
  await ask('Noise-cancelling headphones'); await ans().locator('.gr-itemrow').first().click(); await p.waitForTimeout(300)
  await ans().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(400)
  await ans().getByText('on card ending').last().click(); await p.waitForTimeout(300)
  await p.getByRole('button', { name: /^Pay / }).last().click(); await confirm()
  await ask('where did my money go?')
  await ask('cancel my headphones'); await click('Yes, cancel')
  await ask('where did my money go?'); await full('net')
  await ask('show my statement'); await ask('how much did I spend on shopping this month')
}, { name: 'net', len: 450 })
