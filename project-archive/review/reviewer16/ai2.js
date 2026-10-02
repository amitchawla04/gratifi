const setup = require('./h.js')
module.exports = async () => { const h = await setup('UK', { tag: 'ai2', fake: true }); const { p, shot, nav, ask, btn, confirm, st, lastText, last } = h
  await nav(3)
  const plan = async (code, text) => { await p.evaluate(c => { window.__plan = eval(c) }, code); await ask(text, 1200); const r = await p.evaluate(() => JSON.stringify((window.__res || []).map(x => typeof x === 'string' ? x : { n: x.n, a: x.a, note: x.r?.note, shown: x.r?.shown_to_customer, data: JSON.stringify(x.r?.data || '').slice(0, 250) }))); console.log('>> ' + text + '\n   RES ' + r.slice(0, 900) + '\n   UI ' + (await lastText()).slice(0, 350) + ((await p.$('.app-sheet')) ? ' [SHEET]' : '')); await p.keyboard.press('Escape'); await p.waitForTimeout(200) }
  const pc = (a) => plan(`async (t,o,run) => { await run('prepare_checkout', ${JSON.stringify(a)}); return 'Here it is.' }`, 'checkout ' + JSON.stringify(a))
  await pc({ id: 'ST-Lisbon-0', date: '2026-10-16', nights: 4, quantity: 3, option: 'Double' })
  await pc({ id: 'ST-Lisbon-0', date: '2026-10-16', nights: 4, quantity: 3, rooms: 1 })
  await pc({ id: 'ST-Lisbon-0', date: '2026-09-20', nights: 2 })
  await pc({ id: 'ST-Lisbon-0', date: '2026-10-16', nights: 0 })
  await pc({ id: 'ST-Lisbon-0', date: '2026-10-16', nights: 2.5 })
  await pc({ id: 'ST-Lisbon-0', date: '16/10/2026' })
  await plan(`async (t,o,run) => { await run('search_catalogue', {category:'dining', city:'London'}); await run('search_catalogue', {category:'rides', query:'car hire'}); await run('search_catalogue', {category:'giftcards'}); await run('search_catalogue', {category:'tickets'}); await run('search_catalogue', {category:'experiences', city:'Lisbon'});await run('search_catalogue', {category:'shopping', query:'headphones'});await run('search_catalogue', {category:'rides', query:'train'});await run('search_catalogue', {category:'airport'});await run('search_catalogue', {category:'subs'}); return 'x' }`, 'catalog')
  await h.close() }
