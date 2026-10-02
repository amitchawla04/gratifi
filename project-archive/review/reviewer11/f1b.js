require('./lib.js')('UK', 'famdob', async (h) => {
  const { p } = h
  await h.nav(3); await h.ask('Flights to Lisbon 16th October to 23rd October 2 adults 1 child 1 infant')
  await p.locator('.gr-flight').first().click(); await p.waitForTimeout(500)
  await h.btn(/Continue with/)
  const ins = h.last().locator('input')
  await ins.nth(1).fill('Priya Chawla'); await ins.nth(2).fill('Kabir Chawla'); await ins.nth(4).fill('Mira Chawla')
  await ins.nth(3).fill('2000-01-01'); await ins.nth(5).fill('2023-01-01'); await p.waitForTimeout(300)
  await h.btn(/^Continue$/); await h.tail('after-bad-dob'); console.log('AFTER:', (await h.text()).slice(-600))
})
