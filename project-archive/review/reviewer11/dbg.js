require('./lib.js')('UK', 'dbg', async (h) => {
  const { p } = h
  await h.nav(3); await h.ask('Flights to Lisbon 16th October to 23rd October 2 adults 1 child 1 infant')
  await p.locator('.gr-flight').first().click(); await p.waitForTimeout(500)
  await h.btn(/Continue with/)
  console.log(await h.last().evaluate(e => [...e.querySelectorAll('button')].map(b => `${b.className}|${b.getAttribute('aria-label')}|${b.textContent.trim().slice(0,20)}|${b.disabled}`).join('\n')))
})
