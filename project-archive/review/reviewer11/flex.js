const book = require('./book.js'), C = book.C
require('./lib.js')('UK', 'flex', async (h) => {
  const { p } = h
  await h.nav(3); await h.ask('flights to paris tomorrow for one, one way'); await C(p.locator('.gr-flight').first()); await p.waitForTimeout(400)
  console.log('FARES', (await h.text()).slice(0, 700))
  await C(h.last().getByText('Flex', { exact: true }).first()); await h.btn(/Continue with/); await h.btn(/^Continue$/); console.log('CK', (await h.text()).slice(-450))
  await C(h.last().locator('[role=radio]').last()); await h.btn(/^Pay /); await h.faceid()
  await h.ask('cancel my flight'); console.log('CX', await h.text())
  await h.ask('flights to paris today'); console.log('TODAY', (await h.text()).slice(0, 300))
})
