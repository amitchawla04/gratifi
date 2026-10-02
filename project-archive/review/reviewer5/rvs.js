const pickFlight = async (h, q) => {
  const { p, ask, click, full } = h
  await ask(q); await full('results')
  await p.locator('.gr-flight').first().click(); await p.waitForTimeout(400); await full('fares')
  await click(/Continue with/)
  const ins = p.locator('.gr-answer').last().locator('input.app-in'); for (let i = 0; i < await ins.count(); i++) { if (!(await ins.nth(i).inputValue())) await ins.nth(i).fill(['Priya Sharma', 'Ravi Kumar', 'Anil Rao'][i] || 'Sam Lee') }
  await full('seats'); await click('Continue', { exact: true }); await full('checkout')
}
module.exports = {
  async otp(h) {
    const { p, ask, click, full, shot, nav, st, code, sheetBtn, log, last, url } = h
    await nav(3); await pickFlight(h, 'Flights to Goa next weekend for two')
    const s0 = await st(); log('bal0', s0.balance, 'card', s0.card.balance)
    await click(/^Pay /); await shot('sheet')
    // paste full code into first box
    const ins = await p.$$('.app-sheet input'); await ins[0].focus(); await p.keyboard.insertText('482193'); await p.waitForTimeout(200)
    log('after paste boxes:', await p.$$eval('.app-sheet input', xs => xs.map(x => x.value).join('')))
    // type digit by digit into focused box only
    await ins[0].fill(''); await ins[0].focus(); await p.keyboard.type('482193'); await p.waitForTimeout(200)
    log('after typing into first box:', await p.$$eval('.app-sheet input', xs => xs.map(x => x.value).join('|')), 'focused idx', await p.evaluate(() => [...document.querySelectorAll('.app-sheet input')].indexOf(document.activeElement)))
    await shot('typed')
    for (const c of ['111111', '222222']) { await code(c); await sheetBtn(); await shot('wrong-' + c) }
    await code('333333'); await sheetBtn(); await shot('locked')
    log('btn disabled?', await p.locator('.app-sheet .gr-btn').last().isDisabled())
    const s1 = await st(); log('bal after wrong', s1.balance, 'card', s1.card.balance, 'bookings', s1.bookings.length, 'otp', JSON.stringify(s1.seen.otp))
    await p.keyboard.press('Escape'); await p.waitForTimeout(300); log('sheet after esc', !!(await p.$('.app-sheet')))
    await p.reload(); await p.waitForTimeout(700); await nav(3)
    await click(/^Pay /); await p.waitForTimeout(300); await shot('after-reload')
    log('locked after reload?', await p.locator('.app-sheet .gr-btn').last().isDisabled(), await p.locator('.app-sheet').innerText().catch(() => ''))
    await p.keyboard.press('Escape')
    // try pay bill while locked
    await ask('Pay my bill'); await click(/^Pay /); await p.waitForTimeout(300); await shot('bill-locked'); log('bill locked?', await p.locator('.app-sheet .gr-btn').last().isDisabled()); await p.keyboard.press('Escape')
    // wind the clock back 16 minutes
    await p.evaluate(() => { const k = 'gratifi-state-v3-IN'; const s = JSON.parse(localStorage.getItem(k)); s.seen.otp.at -= 16 * 60000; localStorage.setItem(k, JSON.stringify(s)) }); await p.reload(); await p.waitForTimeout(700); await nav(3)
        const pays = p.getByRole('button', { name: /^Pay / }); log('pay buttons', await pays.count())
    // pay the flight checkout (first Pay button in chat)
    await pays.first().click(); await p.waitForTimeout(300); await shot('unlocked-sheet')
    log('sheet text', (await p.locator('.app-sheet').innerText()).replace(/\n/g, ' / '))
    await code('482193'); await sheetBtn(); await p.waitForTimeout(2600); await full('paid')
    const s2 = await st(); log('bal after', s2.balance, 'card', s2.card.balance, 'bookings', s2.bookings.map(b => b.title + ' ' + b.pts + '+' + b.card).join('; '), 'last', await last())
  },
}
const CITY = { UK: 'Lisbon', EU: 'Rome', IN: 'Goa', AE: 'Muscat', AR: 'Muscat', SG: 'Bali', MY: 'Penang' }
async function buy(h, q, tag, opts = {}) {
  const { p, ask, full, log, st, confirm, last } = h
  await ask(q); const L = await last(); log(tag, 'LIST:', L.slice(0, 200))
  const rows = p.locator('.gr-answer').last().locator('.gr-itemrow')
  if (!(await rows.count())) { await full(tag + '-norows'); return }
  const names = await rows.allInnerTexts(); log(tag, 'rows:', names.map(x => x.replace(/\n/g, ' | ')).slice(0, 5).join(' ## '))
  await rows.nth(opts.nth || 0).click(); await p.waitForTimeout(400)
  if (opts.pre) await opts.pre()
  await full(tag + '-detail')
  const cta = p.locator('.gr-answer').last().locator('.gr-detail .gr-btn').last(); await cta.scrollIntoViewIfNeeded(); await cta.click(); await p.waitForTimeout(500)
  await full(tag + '-checkout'); log(tag, 'CHECKOUT:', (await p.locator('.gr-answer').last().innerText()).replace(/\n/g, ' / ').slice(0, 400))
  const s0 = await st()
  const pay = p.getByRole('button', { name: /^(Pay |ادفع )/ }).last()
  if (await pay.count()) { if (opts.method) { await p.locator('.gr-answer').last().getByText(opts.method, { exact: true }).click().catch(() => log('no method ' + opts.method)); await p.waitForTimeout(200) } await pay.scrollIntoViewIfNeeded(); await pay.click(); await confirm(); await p.waitForTimeout(2400) }
  else { const free = p.locator('.gr-answer .gr-card .gr-btn').last(); await free.click(); await p.waitForTimeout(500) }
  await full(tag + '-done')
  const s1 = await st(); const bk = s1.bookings[0]
  log(tag, 'PAID: pts', s0.balance, '->', s1.balance, 'card', s0.card.balance, '->', s1.card.balance, '| booking', bk && `${bk.title} total=${bk.total} pts=${bk.pts} card=${bk.card} earned=${bk.earned}`, '| ledger', s1.ledger.slice(0, 3).map(l => l.label + ' ' + l.pts).join('; '))
  log(tag, 'SAY:', (await last()).slice(0, 250))
}
module.exports.buyall = async function (h) {
  const { p, nav, market } = h; const c = CITY[market]
  await nav(3)
  if (process.env.SKIP) { } else {
  await buy(h, `A hotel in ${c} for 2 nights`, 'stay', { method: 'Points and card' })
  await buy(h, 'A table tonight for two', 'dine')
  }
  await buy(h, 'A ride now', 'ride', { method: 'Card', pre: async () => { await p.locator('.gr-answer').last().getByRole('button', { name: 'Airport', exact: true }).click(); await p.waitForTimeout(300); h.log('ride price after Airport:', (await p.locator('.gr-answer').last().innerText()).match(/[₹£€RMS$AED\d,.]+\s*\n?\s*or [\d,]+ pts/)?.[0]) } })
  await buy(h, 'Book a lounge', 'lounge')
  await buy(h, `Things to do in ${c}`, 'exp', { method: 'Card' })
  await buy(h, 'Concerts this month', 'tix')
  await buy(h, 'A cabin suitcase', 'shop', { method: 'Card' })
  await buy(h, 'A gift card for a friend', 'gift', { pre: async () => { const ins = p.locator('.gr-answer').last().locator('.app-in'); if (await ins.count() >= 2) { await ins.nth(0).fill('Meera'); await ins.nth(1).fill('meera@example.com') } } })
  await buy(h, 'Start a streaming subscription', 'sub', { method: 'Card' })
  await buy(h, 'eSIM for data abroad', 'esim')
  await buy(h, 'book a train', 'train')
}
module.exports.free = async function (h) {
  const { p, nav, ask, last, log, full, market } = h
  await nav(3)
  const L = (process.env.PH || '').split('||').filter(Boolean)
  for (const ph of L) { await ask(ph, 250); log('>>', ph, '\n      <<', (await last()).slice(0, 260)) }
  await full('end')
}
module.exports.a11y = async function (h) {
  const { p, nav, ask, click, log, shot, full } = h
  const audit = async (where) => {
    const r = await p.evaluate(() => {
      const name = (el) => (el.getAttribute('aria-label') || el.innerText || el.getAttribute('title') || (el.labels && el.labels[0] && el.labels[0].innerText) || el.getAttribute('placeholder') || '').trim()
      const btn = [...document.querySelectorAll('button,[role=button],a')].filter(b => b.offsetParent && !name(b)).map(b => b.outerHTML.slice(0, 120))
      const ins = [...document.querySelectorAll('input,textarea,select')].filter(i => i.offsetParent && !(i.getAttribute('aria-label') || (i.labels && i.labels.length) || i.getAttribute('aria-labelledby'))).map(i => i.outerHTML.slice(0, 140))
      const live = [...document.querySelectorAll('[aria-live],[role=log],[role=status],[role=alert]')].map(e => e.tagName + '.' + e.className.slice(0, 30) + ' live=' + e.getAttribute('aria-live') + ' role=' + e.getAttribute('role'))
      const imgs = [...document.querySelectorAll('img,svg')].filter(i => i.offsetParent && i.tagName === 'IMG' && !i.hasAttribute('alt')).length
      const sw = [...document.querySelectorAll('[role=switch],input[type=checkbox]')].filter(x => x.offsetParent).map(x => (x.getAttribute('aria-label') || (x.labels && x.labels[0] && x.labels[0].innerText) || x.getAttribute('aria-labelledby') || 'NONAME') + ':' + (x.getAttribute('aria-checked') ?? x.checked))
      const small = [...document.querySelectorAll('button')].filter(b => b.offsetParent).map(b => { const r = b.getBoundingClientRect(); return [name(b).slice(0, 20), Math.round(r.width), Math.round(r.height)] }).filter(x => x[1] < 32 || x[2] < 32)
      return { btn, ins, live, imgs, sw: sw.slice(0, 12), small: small.slice(0, 15), lang: document.documentElement.lang, dir: document.documentElement.dir, title: document.title }
    })
    log(where, JSON.stringify(r))
  }
  await audit('home'); await nav(2); await audit('explore'); await nav(3); await audit('chat'); await nav(4); await audit('wallet'); await nav(5); await audit('me')
  // keyboard: tab from start and see focus order in home
  await nav(1); await p.keyboard.press('Tab'); const seq = []
  for (let i = 0; i < 12; i++) { seq.push(await p.evaluate(() => { const a = document.activeElement; return a ? (a.getAttribute('aria-label') || a.innerText || a.tagName).slice(0, 25).replace(/\n/g, ' ') + (getComputedStyle(a).outlineStyle !== 'none' || getComputedStyle(a).boxShadow !== 'none' ? '' : '[NOFOCUSRING]') : '-' })); await p.keyboard.press('Tab') }
  log('tab order home:', seq.join(' > '))
  await shot('focus-home')
  // sheet
  await nav(3); await ask('Milk, eggs and bread'); await click('Checkout'); await p.waitForTimeout(300)
  const pay = p.getByRole('button', { name: /^Pay / }).last(); await pay.focus(); await p.keyboard.press('Enter'); await p.waitForTimeout(400)
  log('sheet open', !!(await p.$('.app-sheet')), 'focused in sheet', await p.evaluate(() => document.querySelector('.app-sheet')?.contains(document.activeElement)), 'active', await p.evaluate(() => document.activeElement?.outerHTML.slice(0, 100)))
  const tr = []; for (let i = 0; i < 6; i++) { await p.keyboard.press('Tab'); tr.push(await p.evaluate(() => (document.querySelector('.app-sheet')?.contains(document.activeElement) ? 'in:' : 'OUT:') + (document.activeElement?.getAttribute('aria-label') || document.activeElement?.innerText || '').slice(0, 20))) }
  log('tab in sheet', tr.join(' > '))
  await p.keyboard.press('Escape'); await p.waitForTimeout(300)
  log('after esc sheet?', !!(await p.$('.app-sheet')), 'focus back on', await p.evaluate(() => document.activeElement?.innerText?.slice(0, 30)))
  // live region content after asking
  await ask('What do I owe?'); log('live region text:', await p.evaluate(() => [...document.querySelectorAll('[aria-live]')].map(e => e.getAttribute('aria-live') + ':' + e.innerText.slice(-120).replace(/\n/g, ' ')).join(' || ')))
  await audit('chat-after')
  // reduced motion
  log('prefers-reduced-motion rules:', await p.evaluate(() => [...document.styleSheets].some(s => { try { return [...s.cssRules].some(r => r.conditionText && r.conditionText.includes('reduced-motion')) } catch (e) { return false } })))
}
module.exports.arscan = async function (h) {
  const { p, nav, ask, log, full, click } = h
  const found = new Map()
  const scan = async (where) => {
    const xs = await p.evaluate(() => { const out = []; const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let n; while ((n = w.nextNode())) { const t = n.nodeValue.trim(); if (!t || !n.parentElement.offsetParent) continue; if (n.parentElement.closest('.gr-bubble-user,.gr-user,[data-role=user]')) continue; if (/[A-Za-z]{3,}/.test(t)) out.push(t.slice(0, 80)) } return out })
    xs.forEach(x => { if (!found.has(x)) found.set(x, where) })
  }
  for (let i = 1; i <= 5; i++) { await nav(i); await scan('tab' + i) }
  await nav(2); const n = await p.locator('.gr-cattile').count()
  for (let i = 0; i < n; i++) { await p.locator('.gr-cattile').nth(i).click(); await p.waitForTimeout(250); await scan('cat' + i); await p.locator('.app-main [aria-label]').first().click().catch(() => {}); await p.waitForTimeout(150); await nav(2) }
  await nav(3)
  const Q = (process.env.PH || '').split('||').filter(Boolean)
  for (const q of Q) { await ask(q, 300); await scan(q) }
  await nav(4); for (const t of await p.locator('.app-main button').allInnerTexts()) { } await scan('wallet')
  await full('end')
  const brands = /Gratifi|Coastline|Northway|Aurora|Harbour|Screenly|Tunewave|Pagebound|Fitloop|Cloudkeep|Daily Ledger|Pantry|Byte Store|Stride|Glow|Home & Hearth|Wander|Cedar|Kanji|Harrow|Salt and Ember|Green Table|Masala|Table Collective|Café Lune|Ride Now|Cloudbox|Fuel Stop|Bloom|Reel House|Arlo Grey|Amit|Chawla|GR-|FL-|GIFT-|DXB|MCT|Stayvale|Clean Seas|Built-in/
  const left = [...found.entries()].filter(([t]) => !brands.test(t))
  log('LATIN LEFT (' + left.length + '):'); left.forEach(([t, w]) => log('  [' + w.slice(0, 30) + '] ' + t))
  log('missing:', JSON.stringify(await p.evaluate(() => [...(window.__missing || [])].slice(0, 60))))
}
const snap = async (h, tag) => { const s = await h.st(); h.log(tag, '| pts', s.balance, '| card', s.card.balance, '| chl', s.challenges.map(c => c.id + ':' + c.progress + (c.done ? 'D' : '') + (c.joined ? 'J' : '')).join(','), '| lounge', s.loungeLeft, '| bk', s.bookings.map(b => `${b.title}[${b.status}] ${b.pts}+${b.card} e${b.earned}`).join('; ')); return s }
const sumLedger = (s) => s.ledger.reduce((a, l) => a + l.pts, 0)
module.exports.integ = async function (h) {
  const { p, nav, ask, click, full, shot, log, st, confirm, last, url } = h
  await nav(3); await ask('hello'); const s00 = await snap(h, 'start'); log('ledger sum == balance?', sumLedger(s00), s00.balance)
  // join challenge 2, add offer 4 (tech)
  await nav(3); await ask('Ways to earn more'); await p.locator('.gr-answer').last().getByRole('button', { name: 'Join' }).first().click(); await p.waitForTimeout(300)
  await ask('Show me card offers'); await full('offers'); for (let i = 0; i < 4; i++) { const a = p.locator('.app-main').getByRole('button', { name: 'Add', exact: true }); if (!(await a.count())) break; await a.first().scrollIntoViewIfNeeded(); await a.first().click(); await p.waitForTimeout(250) }
  await full('offers-added'); await snap(h, 'after join+offers')
  // buy headphones by card (Byte Store tech 8% bonus)
  await ask('Noise-cancelling headphones'); await p.locator('.gr-answer').last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(300)
  await p.locator('.gr-answer').last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(400)
  await p.locator('.gr-answer').last().getByText('Card', { exact: true }).click(); await p.waitForTimeout(200)
  await click(/^Pay /); await confirm(); await p.waitForTimeout(2400); await full('hp-paid')
  const s1 = await snap(h, 'after hp'); log('ledger top', s1.ledger.slice(0, 4).map(l => l.label + ' ' + l.pts).join(' ; ')); log('ledger sum == balance?', sumLedger(s1), s1.balance)
  // dining x2 to finish CHL-1 (joined, progress 1 of 3)
  for (let k = 0; k < 2; k++) { await ask('A table tonight for two'); await p.locator('.gr-answer').last().locator('.gr-itemrow').nth(k).click(); await p.waitForTimeout(300); await p.locator('.gr-answer').last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(400); await p.locator('.gr-answer').last().locator('.gr-card .gr-btn').last().click(); await p.waitForTimeout(500) }
  const s2 = await snap(h, 'after 2 dinners'); log('last', await last()); log('ledger top', s2.ledger.slice(0, 3).map(l => l.label + ' ' + l.pts).join(' ; '))
  // cancel one dinner -> should reverse the 2000 challenge reward
  await ask('cancel my table'); log('cancel ask:', await last()); await full('cancel-table')
  const yes = p.getByRole('button', { name: 'Yes, cancel' }); if (await yes.count()) { await yes.last().click(); await p.waitForTimeout(400) } else { const ob = p.locator('.gr-answer').last().getByRole('button'); log('buttons:', (await ob.allInnerTexts()).join(' | ')); await ob.first().click(); await p.waitForTimeout(400); if (await yes.count()) { await yes.last().click(); await p.waitForTimeout(400) } }
  log('after cancel:', await last()); const s3 = await snap(h, 'after cancel table'); log('ledger top', s3.ledger.slice(0, 3).map(l => l.label + ' ' + l.pts).join(' ; '))
  // cancel headphones: earned + bonus reversed
  await ask('cancel my headphones'); await click('Yes, cancel'); log('hp cancel:', await last()); const s4 = await snap(h, 'after hp cancel'); log('ledger top', s4.ledger.slice(0, 4).map(l => l.label + ' ' + l.pts).join(' ; ')); log('txns top', s4.txns.slice(0, 3).map(t => t.merchant + ' ' + t.amount + (t.refund ? 'R' : '')).join(' ; '))
  await full('hp-cancelled')
  // cancel twice: re-tap old Yes, cancel buttons (all)
  const olds = p.getByRole('button', { name: 'Yes, cancel' }); log('old Yes,cancel count', await olds.count(), 'enabled', await Promise.all([...Array(await olds.count()).keys()].map(i => olds.nth(i).isEnabled())))
  await ask('cancel my headphones'); log('2nd cancel ask:', await last())
  // reload and re-tap
  await p.reload(); await p.waitForTimeout(600); await nav(3)
  const olds2 = p.getByRole('button', { name: 'Yes, cancel' }); log('after reload Yes,cancel count', await olds2.count(), 'enabled', await Promise.all([...Array(await olds2.count()).keys()].map(i => olds2.nth(i).isEnabled())))
  for (let i = 0; i < await olds2.count(); i++) { if (await olds2.nth(i).isEnabled()) { await olds2.nth(i).scrollIntoViewIfNeeded(); await olds2.nth(i).click(); await p.waitForTimeout(400); log('retap result', await last()) } }
  const pays = p.getByRole('button', { name: /^Pay / }); log('old Pay buttons after reload', await pays.count(), 'enabled', await Promise.all([...Array(await pays.count()).keys()].map(i => pays.nth(i).isEnabled())))
  for (let i = 0; i < await pays.count(); i++) { if (await pays.nth(i).isEnabled()) { await pays.nth(i).scrollIntoViewIfNeeded(); await pays.nth(i).click(); await p.waitForTimeout(500); log('old pay tap -> sheet?', !!(await p.$('.app-sheet')), await last()); if (await p.$('.app-sheet')) { await shot('old-pay-sheet'); await p.locator('.app-sheet .gr-btn').last().click(); await p.waitForTimeout(2600); log('after confirming old pay:', await last()) } break } }
  const s5 = await snap(h, 'end'); log('ledger sum == balance?', sumLedger(s5), s5.balance)
  await full('end')
}
module.exports.supplier = async function (h) {
  const { p, nav, ask, click, full, shot, log, st, confirm, last } = h
  await nav(3); await ask('Noise-cancelling headphones'); await p.locator('.gr-answer').last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(300); await p.locator('.gr-answer').last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(400)
  await click(/^Pay /); await confirm(); await p.waitForTimeout(2400)
  await nav(5); await p.getByRole('switch', { name: 'Supplier is down' }).click(); await p.waitForTimeout(200)
  const s0 = await snap(h, 'supplier down on')
  await nav(3)
  const tryit = async (label, fn) => { try { await fn(); } catch (e) { log(label, 'ERR', e.message.split('\n')[0]) } log(label, '=>', (await last()).slice(0, 200)); if (await p.$('.app-sheet')) { log(label, 'SHEET OPEN'); await p.locator('.app-sheet .gr-btn').last().click().catch(() => {}); await p.waitForTimeout(2600); log(label, 'after sheet =>', (await last()).slice(0, 200)) } }
  await tryit('buy stay', async () => { await ask('A hotel in Lisbon'); await p.locator('.gr-answer').last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(300); await p.locator('.gr-answer').last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(400); await click(/^Pay /) })
  await tryit('cancel hp', async () => { await ask('cancel my headphones'); const y = p.getByRole('button', { name: 'Yes, cancel' }); if (await y.count()) await y.last().click(); await p.waitForTimeout(400) })
  await tryit('transfer', async () => { await ask('Transfer points to miles'); await p.locator('.gr-answer').last().locator('input[type=checkbox]').first().check(); await p.locator('.gr-answer').last().locator('.gr-btn').first().click(); await p.waitForTimeout(400) })
  await tryit('donate', async () => { await ask('Donate points to charity'); await p.locator('.gr-answer').last().locator('.gr-btn').first().click(); await p.waitForTimeout(400) })
  await tryit('pay bill', async () => { await ask('What do I owe?'); await click(/^Pay /) })
  await tryit('gift', async () => { await ask('A gift card for a friend'); await p.locator('.gr-answer').last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(300); const ins = p.locator('.gr-answer').last().locator('.app-in'); await ins.nth(0).fill('Sam'); await ins.nth(1).fill('sam@example.com'); await p.locator('.gr-answer').last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(400); await click(/^Pay /) })
  await tryit('flights', async () => { await ask('Flights to Lisbon next weekend') })
  await tryit('grocery', async () => { await ask('Milk, eggs and bread'); await click('Checkout'); await click(/^Pay /) })
  await tryit('lounge free', async () => { await ask('Book a lounge'); await p.locator('.gr-answer').last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(300); await p.locator('.gr-answer').last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(400); await p.locator('.gr-answer').last().locator('.gr-card .gr-btn').last().click(); await p.waitForTimeout(400) })
  await tryit('dining free', async () => { await ask('A table tonight for two'); await p.locator('.gr-answer').last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(300); await p.locator('.gr-answer').last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(400); await p.locator('.gr-answer').last().locator('.gr-card .gr-btn').last().click(); await p.waitForTimeout(400) })
  await tryit('concierge', async () => { await ask('Get me a table at a sold-out restaurant'); await p.fill('.app-ta', 'Saturday 2 people'); await click('Send to the concierge') })
  const s1 = await snap(h, 'end'); log('changed?', s0.balance !== s1.balance || s0.card.balance !== s1.card.balance, 'bookings', s0.bookings.length, '->', s1.bookings.length)
  await full('end')
}
module.exports.flmanage = async function (h) {
  const { p, nav, ask, click, full, shot, log, st, confirm, last } = h
  await nav(3); await pickFlight(h, 'Flights to Lisbon next weekend for two')
  await p.locator('.gr-answer').last().getByText('Card', { exact: true }).click(); await p.waitForTimeout(200)
  await click(/^Pay /); await confirm(); await p.waitForTimeout(2400); await full('booked')
  let s = await snap(h, 'booked'); const b0 = s.bookings[0]; log('extra', JSON.stringify({ seats: b0.extra.seats, backSeats: b0.extra.backSeats, names: b0.extra.names, pax: b0.extra.pax }))
  // change return leg: pick a pricier flight
  await ask('change my flight'); const blk = p.locator('.gr-answer').last()
  await blk.getByText('Flight back', { exact: true }).click(); await p.waitForTimeout(200)
  await blk.locator('.app-days .gr-slot').nth(1).click(); await p.waitForTimeout(300); await full('ret-options')
  const opts = blk.locator('.gr-slots .gr-slot'); const texts = await opts.allInnerTexts(); log('return options', texts.map(t => t.replace(/\n/g, ' ')).join(' ## '))
  let idx = texts.findIndex(t => /more/.test(t)); if (idx < 0) idx = 0; await opts.nth(idx).click(); await p.waitForTimeout(200)
  log('price lines', (await blk.innerText()).split('\n').slice(-6).join(' / '))
  await blk.locator('.gr-btn').last().click(); await p.waitForTimeout(500); log('after continue', await last()); await full('ret-checkout')
  const pay = p.getByRole('button', { name: /^Pay / }); if (await pay.count()) { log('co text', (await p.locator('.gr-answer').last().innerText()).replace(/\n/g, ' / ').slice(0, 400)); await pay.last().click(); await confirm(); await p.waitForTimeout(2400) }
  log('after pay', await last()); await full('ret-changed')
  s = await snap(h, 'after return change'); log('detail', JSON.stringify(s.bookings[0].detail)); log('when', s.bookings[0].when)
  // seats: traveller 2 on return
  await ask('change my seat'); const sb = p.locator('.gr-answer').last(); log('seat block text', (await sb.innerText()).replace(/\n/g, ' ').slice(0, 200))
  await sb.getByText('Flight back', { exact: true }).click().catch(() => log('no flight back seg')); await p.waitForTimeout(200)
  const chips = sb.locator('[role=radio]'); log('who chips', (await chips.allInnerTexts()).join(' | '))
  if (await chips.count() > 1) await chips.nth(1).click()
  // pick a free seat in row 13
  const seats = sb.locator('button[aria-label]'); const labs = await seats.evaluateAll(xs => xs.map(x => x.getAttribute('aria-label') + (x.disabled ? '(x)' : ''))); log('seat labels sample', labs.slice(0, 12).join(','))
  const target = sb.locator('button[aria-label="Seat 13B"]').first(); if (await target.count()) await target.click(); else log('no 13A')
  await p.waitForTimeout(200); await full('seat-picked'); await sb.getByRole('button', { name: /Save seats/ }).click(); await p.waitForTimeout(500); log('seat save', await last())
  s = await snap(h, 'after seats'); log('seats now', JSON.stringify({ seats: s.bookings[0].extra.seats, backSeats: s.bookings[0].extra.backSeats }), 'detail', JSON.stringify(s.bookings[0].detail))
  await nav(4); await click(/Show pass|Boarding pass/); await full('passes')
  log('passes', (await p.locator('.app-main').innerText()).match(/SEAT\s*\n?\s*\w+|PASSENGER\s*\n?[^\n]+\n[^\n]+/g)?.join(' | '))
  // cancel with 30% fee
  await nav(3); await ask('cancel my flight'); log('cancel ask', await last()); await full('fl-cancel-ask'); log('cancel text', (await p.locator('.gr-answer').last().innerText()).replace(/\n/g, ' / '))
  const y = p.getByRole('button', { name: 'Yes, cancel' }); if (await y.count()) { await y.last().click(); await p.waitForTimeout(500) }
  log('cancelled', await last()); s = await snap(h, 'after cancel'); log('txns', s.txns.slice(0, 5).map(t => t.merchant + ' ' + t.amount + (t.refund ? 'R' : '')).join(' ; ')); log('ledger', s.ledger.slice(0, 5).map(l => l.label + ' ' + l.pts).join(' ; '))
  // scroll up: first receipt still original?
  await p.evaluate(() => { const e = document.querySelector('.app-main .app-scroll'); e.scrollTop = 0 }); await p.waitForTimeout(300)
  const rc = await p.locator('.gr-receipt').first().innerText(); log('first receipt now:', rc.replace(/\n/g, ' / '))
  await full('end')
}
module.exports.retreload = async function (h) {
  const { p, nav, ask, click, full, shot, log, st, confirm, last } = h
  await nav(3); await ask('Rain shell jacket'); await p.locator('.gr-answer').last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(300); await p.locator('.gr-answer').last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(400)
  await click(/^Pay /); await confirm(); await p.waitForTimeout(2400)
  await ask('return my jacket'); log('before delivery:', await last())
  await nav(5); await click('Deliver my order'); await nav(3); log('deliver msg:', await last())
  await ask('return my jacket'); log('return ask:', await last()); await full('return-ask')
  const btns = p.locator('.gr-answer').last().getByRole('button'); log('buttons', (await btns.allInnerTexts()).join(' | '))
  await btns.last().click().catch(() => {}); await p.waitForTimeout(500); log('after btn:', await last()); await full('return-booked')
  const b1 = (await st()).bookings[0]; log('bk', b1.status, JSON.stringify(b1.tracker))
  await p.reload(); await p.waitForTimeout(30000)
  const s2 = await st(); log('after reload+30s', s2.bookings[0].status, JSON.stringify(s2.bookings[0].tracker), 'pts', s2.balance)
  // claim timer
  await nav(3); await ask('Noise-cancelling headphones'); await p.locator('.gr-answer').last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(300); await p.locator('.gr-answer').last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(400)
  await click(/^Pay /); await confirm(); await p.waitForTimeout(2400)
  await nav(5); await click('Deliver my order'); await nav(3)
  await ask('my headphones arrived broken'); log('claim ask', await last()); await full('claim')
  await p.locator('.gr-answer').last().getByRole('button', { name: 'It arrived damaged' }).click().catch(() => {}); await p.locator('.gr-answer').last().getByRole('button', { name: /Add a photo/ }).click().catch(e => log('photo err')); await p.waitForTimeout(300); await full('photo')
  await click('Send claim'); log('claim sent', await last())
  await p.reload(); await p.waitForTimeout(45000); const s3 = await st(); const cl = s3.bookings.find(b => b.kind === 'claim'); log('claim after reload+45s', cl.status, JSON.stringify(cl.tracker), 'hp', s3.bookings.find(b => /headphones/.test(b.title) && b.kind !== 'claim').status)
}
module.exports.demo = async function (h) {
  const { p, nav, ask, click, full, shot, log, st, confirm, last, market } = h
  await nav(5)
  for (const b of ['Cancel my next flight', 'Delay my order', 'Deliver my order']) { await click(b); await p.waitForTimeout(300); log('empty', b, '=>', await last(), 'tab', await p.evaluate(() => document.querySelector('.app')?.dataset.tab)); await nav(5) }
  await click(/Points come in/); await click('A card payment'); log('card payment =>', await last()); await nav(5)
  await click('Suspicious payment'); log('suspicious =>', await last()); await full('suspicious'); const s = await snap(h, 'after suspicious'); log('frozen', s.card.frozen)
  const btns = p.locator('.gr-answer').last().getByRole('button'); log('susp buttons', (await btns.allInnerTexts()).join(' | '))
  await btns.first().click(); await p.waitForTimeout(400); log('after first btn =>', await last()); if (await p.$('.app-sheet')) { log('sheet!'); await confirm() } await full('susp-after')
  // unfreeze via chat toggle
  await ask('Freeze my card'); log('freeze =>', await last(), (await st()).card.frozen)
  await nav(5); await click('A card payment'); log('card payment while frozen =>', await last()); await nav(3)
  await ask('unfreeze my card'); log('unfreeze =>', await last(), 'sheet', !!(await p.$('.app-sheet'))); if (await p.$('.app-sheet')) await confirm(); log('frozen now', (await st()).card.frozen, await last())
  // turn off online then on
  await ask('turn off online payments'); log('off =>', await last(), (await st()).card.online)
  await ask('turn on online payments'); log('on =>', await last(), 'sheet', !!(await p.$('.app-sheet'))); if (await p.$('.app-sheet')) await confirm(); log('online', (await st()).card.online)
  // toggle in controls UI: switch off contactless then on
  const sw = p.locator('.gr-answer').last().getByRole('switch', { name: /Contactless/ }); if (await sw.count()) { await sw.click(); await p.waitForTimeout(300); log('contactless off via switch', (await st()).card.contactless, await last()); const sw2 = p.locator('.app-main').getByRole('switch', { name: /Contactless/ }).last(); await sw2.click(); await p.waitForTimeout(300); log('switch back on -> sheet', !!(await p.$('.app-sheet'))); if (await p.$('.app-sheet')) await confirm(); log('contactless', (await st()).card.contactless) } else log('no contactless switch')
  // bill: another amount
  await ask('What do I owe?'); const pb = p.locator('.gr-answer').last(); await pb.getByText('Another amount').click(); await p.waitForTimeout(200); await full('another-amount')
  const inp = pb.locator('input'); log('amount inputs', await inp.count())
  if (await inp.count()) { await inp.last().fill('99999'); await p.waitForTimeout(200); log('pay btn text (99999)', await pb.getByRole('button', { name: /^Pay/ }).innerText().catch(() => 'none'), 'disabled', await pb.getByRole('button', { name: /^Pay/ }).isDisabled().catch(() => '?')); await inp.last().fill('0'); log('pay btn text (0)', await pb.getByRole('button', { name: /^Pay/ }).innerText().catch(() => 'none'), 'disabled', await pb.getByRole('button', { name: /^Pay/ }).isDisabled().catch(() => '?')); await inp.last().fill('12.345'); log('pay btn text (12.345)', await pb.getByRole('button', { name: /^Pay/ }).innerText().catch(() => 'none')); await inp.last().fill('abc'); log('pay btn text (abc)', await pb.getByRole('button', { name: /^Pay/ }).innerText().catch(() => 'none'), await pb.getByRole('button', { name: /^Pay/ }).isDisabled().catch(() => '?')); await inp.last().fill('50'); await full('amount-50'); await pb.getByRole('button', { name: /^Pay/ }).click(); await confirm(); log('paid 50 =>', await last(), (await st()).card.balance) }
  await ask('Set up Direct Debit'); log('dd =>', await last()); await full('dd'); const ddb = p.getByRole('button', { name: /Direct Debit|Set up/ }).last(); if (await ddb.count()) { await ddb.click(); await p.waitForTimeout(300); log('dd sheet', !!(await p.$('.app-sheet'))); if (await p.$('.app-sheet')) await confirm(); log('autopay', (await st()).card.autopay, await last()) }
  // subscription resume
  await ask('Start a streaming subscription'); await p.locator('.gr-answer').last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(300); await p.locator('.gr-answer').last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(400); await click(/^Pay /); await confirm(); await p.waitForTimeout(2400)
  await ask('pause screenly'); log('pause =>', await last()); await ask('resume screenly'); log('resume =>', await last(), 'sheet', !!(await p.$('.app-sheet'))); if (await p.$('.app-sheet')) { await shot('resume-sheet'); await confirm() } log('sub status', (await st()).bookings.find(b => b.kind === 'sub')?.status, await last())
  await ask('cancel screenly'); log('cancel sub =>', await last()); const yc = p.getByRole('button', { name: 'Yes, cancel' }); if (await yc.count()) { await yc.last().click(); await p.waitForTimeout(300) } log('after =>', await last())
  // reset
  await nav(5); await click('Reset demo'); await p.waitForTimeout(200); await shot('reset-confirm'); await click('Yes, reset'); await p.waitForTimeout(300); const s9 = await snap(h, 'after reset'); log('chat len', s9.chat.length, 'otp', JSON.stringify(s9.seen))
}
module.exports.resume = async function (h) {
  const { p, nav, ask, click, full, shot, log, st, confirm, last } = h
  await nav(3); await ask('Start a streaming subscription'); await p.locator('.gr-answer').last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(300); await p.locator('.gr-answer').last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(400)
  await p.locator('.gr-answer').last().getByText('Card', { exact: true }).click(); await click(/^Pay /); await confirm(); await p.waitForTimeout(2400)
  await nav(4); await p.getByText('Subscriptions', { exact: false }).first().click(); await p.waitForTimeout(200); await click('Pause'); await p.waitForTimeout(300); log('pause', await last())
  await nav(4); await p.getByText('Subscriptions', { exact: false }).first().click(); await p.waitForTimeout(200); await click('Resume'); await p.waitForTimeout(400); log('sheet', !!(await p.$('.app-sheet'))); await shot('resume-sheet'); if (await p.$('.app-sheet')) log((await p.locator('.app-sheet').innerText()).replace(/\n/g, ' / '))
}
module.exports.misc = async function (h) {
  const { p, nav, ask, click, full, shot, log, st, confirm, last } = h
  await nav(3)
  await ask('Earn extra points shopping'); log('aff', await last()); await full('aff-list')
  const r = p.locator('.gr-answer').last().locator('.gr-itemrow'); if (await r.count()) { await r.first().click(); await p.waitForTimeout(300); await full('aff-detail'); log('aff detail', (await p.locator('.gr-answer').last().innerText()).replace(/\n/g, ' / ').slice(0, 400)); const btns = p.locator('.gr-answer').last().getByRole('button'); log('aff btns', (await btns.allInnerTexts()).join(' | ')) }
  const shopBtn = p.getByRole('button', { name: /Shop on|Go to|Open/ }).last(); if (await shopBtn.count()) { await shopBtn.click(); await p.waitForTimeout(300); log('after shop btn', await last()); await full('aff-open') }
  const bought = p.getByRole('button', { name: /I bought something/ }).last(); if (await bought.count()) { await bought.click(); await p.waitForTimeout(300); log('bought', await last()); const s = await st(); log('pending', JSON.stringify(s.pending), 'card', s.card.balance) }
  await ask('Earn extra points shopping'); await r.first().click().catch(() => {}); await p.waitForTimeout(300); const sb2 = p.getByRole('button', { name: /Shop on|Go to|Open/ }).last(); if (await sb2.count()) await sb2.click(); await p.waitForTimeout(300); const b2 = p.getByRole('button', { name: /I bought something/ }).last(); if (await b2.count() && await b2.isEnabled()) { await b2.click(); await p.waitForTimeout(300); const s = await st(); log('pending after 2nd', JSON.stringify(s.pending), 'card', s.card.balance) }
  await nav(1); await full('home-pending')
  await nav(3)
  // stays guests
  await ask('hotel in Lisbon 20-23 Oct for 3 adults'); await p.locator('.gr-answer').last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(300); await full('stay3'); log('stay3 detail', (await p.locator('.gr-answer').last().innerText()).replace(/\n/g, ' / ').slice(0, 500))
  // dining tomorrow
  await ask('book a table at Kanji tomorrow 7.30pm for 6'); await full('kanji'); log('kanji', (await p.locator('.gr-answer').last().innerText()).replace(/\n/g, ' / ').slice(0, 400))
  const cta = p.locator('.gr-answer').last().locator('.gr-detail .gr-btn').last(); await cta.click(); await p.waitForTimeout(400); log('kanji co', (await p.locator('.gr-answer').last().innerText()).replace(/\n/g, ' / ').slice(0, 300))
  await ask('cheapest flight to Paris for 3 adults and 1 infant'); log('infant', await last()); await p.locator('.gr-flight').first().click(); await p.waitForTimeout(300); log('fares', (await p.locator('.gr-answer').last().innerText()).replace(/\n/g, ' / ').slice(-160))
  await ask('Flights to Lisbon tonight'); await full('tonight')
}
module.exports.retap = async function (h) {
  const { p, nav, ask, click, full, shot, log, st, confirm, last } = h
  await nav(3); await pickFlight(h, 'Flights to Lisbon next weekend for two'); await click(/^Pay /); await confirm(); await p.waitForTimeout(2400)
  const n0 = (await st()).bookings.length
  await p.reload(); await p.waitForTimeout(600); await nav(3)
  await p.evaluate(() => { document.querySelector('.app-main .app-scroll').scrollTop = 0 }); await p.waitForTimeout(300)
  // re-tap flight card
  await p.locator('.gr-flight').first().click(); await p.waitForTimeout(500); log('retap flight card =>', await last())
  const cont = p.getByRole('button', { name: /Continue with/ }); log('continue-with buttons', await cont.count(), await Promise.all([...Array(await cont.count()).keys()].map(i => cont.nth(i).isEnabled())))
  await cont.first().click().catch(e => log('first continue not clickable')); await p.waitForTimeout(400); log('retap continue-with (first) =>', await last())
  const c2 = p.getByRole('button', { name: 'Continue', exact: true }); log('seat Continue buttons', await c2.count(), await Promise.all([...Array(await c2.count()).keys()].map(i => c2.nth(i).isEnabled())))
  for (let i = 0; i < await c2.count(); i++) if (await c2.nth(i).isEnabled()) { await c2.nth(i).click(); await p.waitForTimeout(400); log('seat continue', i, '=>', await last()); break }
  const pays = p.getByRole('button', { name: /^Pay / }); log('pay buttons', await pays.count(), await Promise.all([...Array(await pays.count()).keys()].map(i => pays.nth(i).isEnabled())))
  for (let i = 0; i < await pays.count(); i++) if (await pays.nth(i).isEnabled()) { await pays.nth(i).click(); await p.waitForTimeout(400); log('pay', i, 'sheet?', !!(await p.$('.app-sheet')), await last()); if (await p.$('.app-sheet')) { await shot('dup-sheet'); await confirm(); await p.waitForTimeout(2400); log('after dup pay =>', await last()) } break }
  await full('after-retap')
  const s = await st(); log('bookings', n0, '->', s.bookings.length, s.bookings.map(b => b.title + '[' + b.status + ']').join('; '), 'card', s.card.balance, 'pts', s.balance)
}
module.exports.cal = async function (h) {
  const { p, nav, ask, click, full, shot, log, st, confirm, last } = h
  await nav(3); await ask('Cheaper dates to Lisbon'); log(await last()); await ask('cheaper dates?'); log(await last())
  const nx = p.locator('.gr-answer').last().getByRole('button', { name: /next|Next month|›|>/i }); log('next btns', await nx.count(), await p.locator('.gr-answer').last().locator('button[aria-label]').evaluateAll(xs => xs.map(x => x.getAttribute('aria-label')).slice(0, 6)))
  const b = p.locator('.gr-answer').last().locator('button[aria-label]').nth(1); await b.click().catch(() => { }); await p.waitForTimeout(300); await full('cal-next')
}
module.exports.home = async function (h) {
  const { p, nav, ask, click, full, shot, log, st, confirm, last } = h
  const tab = () => p.evaluate(() => document.querySelector('.app')?.dataset.tab)
  for (const name of ['Alerts', 'UK', 'Show ideas', 'See all', 'All offers', 'Use points', 'Transfer']) { await nav(1); const b = p.getByRole('button', { name, exact: true }).first(); if (!(await b.count())) { log('missing', name); continue } await b.click(); await p.waitForTimeout(400); log(name, '-> tab', await tab(), '|', (await last().catch(() => '')).slice(0, 120)); if (name === 'Alerts' || name === 'UK') await shot(name) ; await p.keyboard.press('Escape') }
  await nav(1); await p.getByRole('button', { name: 'Not now' }).click(); await p.waitForTimeout(300); log('not now -> sticky still?', await p.getByText(/points expire/).count())
  await p.reload(); await p.waitForTimeout(500); log('after reload sticky?', await p.getByText(/points expire/).count())
  await p.getByRole('button', { name: 'Add', exact: true }).first().click(); await p.waitForTimeout(300); log('home add offer ->', await tab(), (await last()).slice(0, 120))
  await shot('home-after')
}
module.exports.clear = async function (h) {
  const { p, nav, ask, click, log, st, shot } = h
  await nav(3); await ask('What do I owe?'); await ask('Freeze my card'); await click('Clear'); await p.waitForTimeout(300); await shot('after-clear'); log('chat len', (await st()).chat.length, 'text', (await p.locator('.app-main').innerText()).slice(0, 150).replace(/\n/g, ' / '))
  // mic button
  await p.getByRole('button', { name: /voice|mic|speak/i }).first().click().catch(e => log('no mic by name')); await p.waitForTimeout(400); await shot('mic'); log('after mic', (await p.locator('.app-main').innerText()).slice(-150).replace(/\n/g, ' / '))
  // empty input enter / very long input
  await ask(''); await ask('a'.repeat(600)); log('long =>', (await h.last()).slice(0, 120))
  await ask('<img src=x onerror=alert(1)>'); log('html =>', (await h.last()).slice(0, 120))
}
