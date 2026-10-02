require('./h.js')('UK', async (h) => {
  const { p, ask, click, full, confirm, nav, st, log, ans, shot, sheet } = h
  await nav(3)
  await ask('flights to Paris from 21 to 25 October for 2')
  await ans().locator('.gr-flight').first().click(); await p.waitForTimeout(400)
  await ans().locator('.gr-btn', { hasText: 'Continue with' }).click(); await p.waitForTimeout(400)
  await ans().locator('input').nth(1).fill('Sam Taylor'); await ans().locator('.gr-btn').last().click(); await p.waitForTimeout(500)
  await p.getByRole('button', { name: /^Pay / }).last().click(); await confirm()
  await ask('Add a hotel')
  await ans().locator('.gr-itemrow').first().click(); await p.waitForTimeout(400)
  log('DET ' + (await h.lastText()).replace(/\n+/g, ' | ').replace(/\| (Mon|Tue|Wed|Thu|Fri|Sat|Sun) \d+ (Sep|Oct|Nov|Dec) /g, '').slice(0, 500))
  await ask('Airport ride'); await ask('a ride to the airport on 21 October at 4am')
  log('RIDE ' + (await h.lastText()).replace(/\n+/g, ' | ').slice(0, 500))
  await ask('Book a lounge'); 
  await ask('things to do in Paris')
  await ask('cancel my Paris flight'); await full('trip-cancel')
}, { name: 'trip', len: 500 })
