const M = process.argv[2] || 'UK'
require('./h.js')(M, async (h) => {
  const { p, ask, click, full, confirm, nav, st, log, ans, shot, sheet } = h
  const back = async () => { await nav(1); await p.waitForTimeout(300) }
  const tap = async (sel, name) => { try { await p.locator(sel).first().scrollIntoViewIfNeeded(); await p.locator(sel).first().click({ timeout: 5000 }); await p.waitForTimeout(700); const tab = await p.evaluate(() => document.querySelector('.app')?.getAttribute('data-tab')); log(`TAP ${name} -> tab=${tab}: ` + (tab === 'chat' ? (await h.lastText()).replace(/\n+/g, ' | ').slice(0, 350) : (await p.locator('.app-main').innerText()).replace(/\n+/g, ' | ').slice(0, 250))) } catch (e) { log('TAP FAIL ' + name + ' ' + e.message.slice(0, 100)) } await back() }
  await tap('text=See flights', 'banner see flights')
  await tap('text=Get tickets', 'banner 2')
  await tap('text=Show ideas', 'sticky show ideas')
  await tap('text=Use points', 'use points')
  await tap('text=Transfer >> nth=0', 'transfer')
  await tap('text=Tidewater House', 'featured hotel')
  await tap('text=Food market tour', 'featured tour')
  await tap('text=Flights to Lisbon this weekend', 'chip flights')
  await tap('text=Groceries now', 'chip groceries')
  await tap('text=All offers', 'all offers')
  await tap('.gr-nav + * , [aria-label="Notifications"]', 'bell')
  await tap('text=See all >> nth=1', 'featured see all')
  // explore subcats
  await nav(2); await p.locator('.gr-cattile').first().click(); await p.waitForTimeout(400); await full('explore-flights'); log('EXPLORE FLIGHTS: ' + (await p.locator('.app-main').innerText()).replace(/\n+/g, ' | ').slice(0, 600))
  const subs = p.locator('.app-main button'); log('subs count ' + await subs.count())
}, { name: 'home-' + M, len: 400 })
