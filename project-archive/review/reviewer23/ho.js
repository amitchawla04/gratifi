const H = require('./h.js')
H.run(async (h) => { const { p, ask, click, full, log, nav } = h; const A = () => p.locator('.gr-answer').last()
 await p.getByRole('button', { name: 'See flights' }).first().click(); await p.waitForTimeout(900); log('banner ->', (await A().innerText()).replace(/\s+/g,' ').slice(0,250))


 await nav(3); await ask('one way to lisbon on friday for 1'); const rows = A().locator('.gr-flight'); const n = await rows.count(); log('n flights', n)
 for (const i of [0, n-1]) { const t = (await rows.nth(i).innerText()).replace(/\s+/g,' '); await rows.nth(i).click(); await p.waitForTimeout(500); const f = (await A().innerText()).replace(/\s+/g,' '); log('LIST', t, '\n   FARES', (f.match(/Light.{0,120}/)||[''])[0]); await ask('one way to lisbon on friday for 1') }
}, { m: 'UK', tag: 'ho' })
