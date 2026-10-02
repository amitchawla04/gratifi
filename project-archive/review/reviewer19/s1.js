require('./h.js')('UK', async (h) => {
  const { p, ask, click, full, confirm, nav, st, log, ans, shot } = h
  await nav(3)
  await ask('flights to barcelona on 14/10 returning 18 october, 2 adults and a 1 year old')
  await ans().locator('.gr-flight').first().click(); await p.waitForTimeout(400)
  log('FARES: ' + (await h.lastText()).replace(/\n+/g,' | ').slice(0,700))
  await click(/Continue with/); await p.waitForTimeout(400)
  log('SEATS: ' + (await h.lastText()).replace(/\n+/g,' | ').slice(0,1500))
  await full('seats')
  const ins = ans().locator('input'); const k = await ins.count(); for (let i=0;i<k;i++){ log('input', i, await ins.nth(i).getAttribute('type'), await ins.nth(i).getAttribute('aria-label'), await ins.nth(i).inputValue()) }
}, { name: 's1' })
