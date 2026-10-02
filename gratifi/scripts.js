const CITY = { UK: 'Lisbon', EU: 'Rome', IN: 'Goa', AE: 'Muscat', AR: 'Muscat', SG: 'Bali', MY: 'Penang' }
const mk = () => process.argv[2] || 'UK'
async function payOrFree(h, tag) {
  const { p, click, confirm, full } = h
  await p.waitForTimeout(300)
  const pay = p.getByRole('button', { name: /^(Pay |ادفع )/ }).last()
  if (await pay.count()) { await pay.scrollIntoViewIfNeeded(); await pay.click(); await confirm(); await full(tag + '-done'); return }
  const free = p.locator('.gr-answer').last().locator('.gr-card .gr-btn:not([disabled]), .ds-paycard .gr-btn:not([disabled]), .ds-cine .gr-btn:not([disabled])').last()
  if (!(await free.count())) { await full(tag + '-done'); return }
  await free.scrollIntoViewIfNeeded(); await free.click(); await p.waitForTimeout(500); await full(tag + '-done')
}
async function buyFirst(h, q, tag, nth = 0, pre) {
  const { p, ask, full } = h
  await ask(q); await full(tag + '-list')
  await p.locator('.gr-answer').last().locator('.ds-best-ph, .ds-irow, .gr-itemrow, .ds-orow-b, .ds-rtile').nth(nth).click(); await p.waitForTimeout(400)
  if (pre) await pre()
  { const b = p.locator('.gr-answer').last().locator('.gr-detail .gr-btn').last(); if (/Pick a size|اختر المقاس/.test(await b.innerText().catch(() => ''))) { await p.locator('.gr-answer').last().locator('.gr-chip').nth(1).click(); await p.waitForTimeout(150) } }
  await full(tag + '-detail')
  const cta = p.locator('.gr-answer').last().locator('.gr-detail .gr-btn').last(); await cta.scrollIntoViewIfNeeded(); await cta.click(); await p.waitForTimeout(400)
  await full(tag + '-checkout'); await payOrFree(h, tag)
}
module.exports = {
  async tabs({ full, nav, p }) { await full('home'); await nav(2); await full('explore'); await nav(3); await full('chat'); await nav(4); await full('wallet'); await nav(5); await full('me')
    for (const [t, c] of [['card'], ['card', 'benefits'], ['alerts'], ['tier'], ['offers'], ['explore', 'stays'], ['explore', 'bank'], ['wallet', 'Points'], ['bank']]) { await p.evaluate(([t, c]) => window.__go(t, c), [t, c]); await p.waitForTimeout(700); await full(t + (c ? '-' + c : '')) } },
  async flight(h) {
    const { ask, click, full, confirm, nav, p } = h
    await nav(3); await ask(`Flights to ${CITY[mk()]} next weekend for two`); await full('results')
    await p.locator('.gr-answer').last().locator('.ds-fl').first().click(); await p.waitForTimeout(400); await full('fares')
    await click(/Continue with/); await full('seats')
    { const ins = p.locator('.gr-answer').last().locator('input.app-in'); for (let i = 0; i < await ins.count(); i++) { if (!(await ins.nth(i).inputValue())) await ins.nth(i).fill('Sam Taylor') } } await click('Continue', { exact: true }); await full('extras'); await click('Continue', { exact: true }); await full('checkout')
    await click(/^Pay /); await confirm(); await full('receipt')
    await ask('Only direct'); await ask('Cheaper dates?'); await full('followups')
    await nav(4); await full('wallet')
    await click(/Show pass|Boarding pass/); await full('pass')
    await nav(5); await click('Cancel my next flight'); await full('disruption')
    await click('Move to this flight', { exact: true }); await full('rebooked')
  },
  async flightplus(h) {
    const { ask, click, full, confirm, nav, p, errs } = h
    const A = () => p.locator('.gr-answer').last()
    const cta = async () => { await A().locator('.ds-btn48').last().click(); await p.waitForTimeout(450) }
    await nav(3); await ask(`Flights to ${CITY[mk()]} next weekend for two`)
    await A().locator('.ds-fl').first().click(); await p.waitForTimeout(400); await cta()
    { const ins = A().locator('input.app-in'); for (let i = 0; i < await ins.count(); i++) { if (!(await ins.nth(i).inputValue())) await ins.nth(i).fill('Sam Taylor') } } await cta(); await full('extras')
    if (!(await A().locator('.c2-prow').count())) errs.push('NO EXTRAS CARD')
    await A().locator('.c2-prow').nth(0).click(); await A().locator('.c2-prow').nth(2).click(); await cta(); await full('checkout-extras')
    { const ch = A().locator('.ds-pay-ch [role=radio]'); if (await ch.count() > 1) { await ch.nth(1).click(); await p.waitForTimeout(250); const r = A().locator('input.c2-range'); if (await r.count()) { const mx = await r.getAttribute('max'); await r.fill(String(Math.max(100, Math.floor(+mx / 200) * 100))) } else errs.push('NO SPLIT SLIDER') } }
    await full('split'); await click(/^Pay /); await confirm(); await full('booked')
    await ask('add a bag'); await full('bags'); await cta(); await click(/^Pay /); await confirm(); await full('bag-added')
    await ask('upgrade my flight to business'); await full('upgrade'); await cta(); await click(/^Pay /); await confirm(); await full('upgraded')
    await ask('the spelling of my name is wrong on my ticket'); await full('namefix')
    { const inp = A().locator('.c2-in input'); if (await inp.count()) { await A().locator('.c2-prow').first().click(); await inp.fill(((await inp.inputValue()) || 'Amit Chawla').replace(/a$/, 'aa')); await cta(); await full('namefixed') } else errs.push('NO NAME FIX') }
    await ask('check in for my flight'); await full('ci-closed')
    { const b = A().locator('.gr-state .gr-btn'); if (await b.count()) await b.first().click(); else errs.push('NO AUTO CHECK-IN') } await p.waitForTimeout(400)
    await nav(5); await click('Check-in opens'); await full('ci-auto')
    if (!(await p.locator('.ds-ticket').count())) errs.push('NO BOARDING PASS AFTER CHECK-IN')
    await ask('flight status'); await full('status')
    await nav(5); await click('Delay my next flight'); await full('delayed')
    if (!(await p.locator('.c2-tl li.chg').count())) errs.push('NO CHANGE SHOWN')
    await ask('my luggage never arrived'); await full('lostbag'); if (await A().locator('.c2-slot').count()) { await cta(); await full('lostbag-sent') } else errs.push('NO LOST BAG FORM')
  },
  async fares(h) {
    const { ask, click, full, nav, p, errs } = h
    const A = () => p.locator('.gr-answer').last()
    const BACK = { UK: 'Barcelona', EU: 'Paris', IN: 'Delhi', AE: 'Istanbul', AR: 'Istanbul', SG: 'Bangkok', MY: 'Langkawi' }
    await nav(3); await ask(`Flights to ${CITY[mk()]} next Friday`); await full('search')
    await click('Watch price'); await full('watching')
    if (!(await A().locator('.gr-state').count())) errs.push('NO WATCH CARD')
    await nav(5); await click('Fare drops'); await full('dropped')
    if (!(await A().locator('.ds-fl').count())) errs.push('NO FLIGHTS AFTER DROP')
    await ask(`Flights to ${CITY[mk()]} next Friday back from ${BACK[mk()]} on Monday`); await full('openjaw')
    if (!(await A().locator('.ds-fl').count())) errs.push('NO OPEN-JAW FLIGHTS')
    else { await A().locator('.ds-fl').first().click(); await p.waitForTimeout(500); await full('openjaw-fare'); if (!(await A().locator('.app-fs').count())) errs.push('NO OPEN-JAW FARES') }
  },
  async cardchat(h) {
    const { ask, click, full, confirm, nav, p, errs } = h
    const A = () => p.locator('.gr-answer').last()
    const need = async (sel, what) => { if (!(await A().locator(sel).count())) { errs.push('NO ' + what); return false } return true }
    const cta = async () => { await A().locator('.ds-btn48').last().click(); await p.waitForTimeout(450) }
    await nav(3)
    await ask('I was charged twice'); await full('dispute')
    if (await need('.c2-prow', 'DISPUTE PICKER')) { await A().locator('.c2-prow').first().click(); await p.waitForTimeout(200); await cta(); await confirm(); await full('dispute-sent') }
    await ask('I want to spread the cost of a big purchase'); await full('plan')
    if (await A().locator('.c2-card').count()) { await cta(); await confirm(); await full('plan-set') }
    await ask('balance transfer'); await full('bt')
    if (await need('.c2-in input', 'BT FORM')) { const ins = A().locator('.c2-in input'); await ins.nth(0).fill('Harbour Bank'); await ins.nth(1).fill('4417'); await ins.nth(2).fill('300'); await cta(); await confirm(); await full('bt-sent') }
    await ask('add my wife to my card'); await full('holder')
    if (await need('.c2-in input', 'HOLDER FORM')) { const ins = A().locator('.c2-in input'); await ins.nth(0).fill('Priya Shah'); await ins.nth(1).fill('1990-05-14'); await cta(); await confirm(); await full('holder-sent') }
    await ask('pay off a purchase with my points'); await full('ptspay')
    if (await need('.c2-prow', 'POINTS PAY')) { await cta(); await confirm(); await full('ptspay-done') }
    await ask('send 1000 points to my wife'); await full('ptssend')
    if (await need('.c2-in input', 'SEND POINTS FORM')) { const ins = A().locator('.c2-in input'); await ins.nth(0).fill('Priya Shah'); await ins.nth(1).fill('48201937'); await cta(); await confirm(); await full('ptssend-done') }
    await ask("I didn't get my points for a purchase"); await full('ptsclaim')
    if (await need('.c2-prow', 'POINTS CLAIM')) { await A().locator('.c2-prow').first().click(); await cta(); await full('ptsclaim-done') }
    await ask('claim on purchase protection'); await full('protect')
    if (await A().locator('.c2-prow').count()) { await A().locator('.c2-prow').first().click(); await A().locator('.c2-slot').first().click(); await A().locator('.c2-in input').fill('Headphones'); await cta(); await confirm(); await full('protect-sent') } else errs.push('NO PROTECT LIST')
    await ask('upgrade my card'); await full('cardswitch'); if (await need('.c2-cmp', 'CARD COMPARE')) { await cta(); await confirm(); await full('cardswitch-sent') }
    await ask('remove my wife from my card'); await full('holder-remove'); { const b = A().locator('.ds-opill'); if (await b.count()) { await b.first().click(); await p.waitForTimeout(300); await confirm(); await full('holder-removed') } else errs.push('NO REMOVE CARDHOLDER') }
    await nav(5); await click('Bank decides cases'); await full('cases')
  },
  async stays(h) { await h.nav(3); await buyFirst(h, `A hotel in ${CITY[mk()]} with a pool`, 'stay') },
  async dining(h) { await h.nav(3); await buyFirst(h, 'A table tonight for two', 'dine', 0, async () => { await h.p.locator('.gr-slot').nth(2).click() }) },
  async grocery(h) {
    const { ask, click, full, confirm, nav, p } = h
    await nav(3); await ask('Milk, eggs and bread'); await full('basket')
    await click('Checkout'); await full('checkout'); await click(/^Pay /); await confirm(); await full('done')
    await ask('Track my order'); await nav(5); await click('Delay my order'); await full('late')
    await click('Cancel for a full refund'); await full('cancel-ask'); await click('Yes, cancel'); await full('refunded')
  },
  async shopping(h) { await h.nav(3); await buyFirst(h, 'Noise-cancelling headphones', 'shop') ; await h.nav(4); await h.full('wallet') },
  async gift(h) { await h.nav(3); await buyFirst(h, 'A gift card for a friend', 'gift', 0, async () => { await h.p.locator('.app-in').nth(0).fill('Sam'); await h.p.locator('.app-in').nth(1).fill('sam@example.com') }); await h.nav(4); await h.click('Show code'); await h.full('code') },
  async subs(h) { await h.nav(3); await buyFirst(h, 'What subscriptions come with my card?', 'subs', 1); await buyFirst(h, 'Start a streaming subscription', 'subs2', 2); await h.nav(4); await h.full('wallet-subs'); await h.click('Pause'); await h.full('paused') },
  async tickets(h) { await h.nav(3); await buyFirst(h, 'Concerts this month', 'tix') },
  async airport(h) { await h.nav(3); await buyFirst(h, 'Book a lounge', 'lounge') },
  async rides(h) { await h.nav(3); await buyFirst(h, 'A ride now', 'ride', 0, async () => { await h.p.locator('.gr-detail .gr-slot').last().click() }) },
  async experiences(h) { await h.nav(3); await buyFirst(h, `Things to do in ${CITY[mk()]}`, 'exp') },
  async bank(h) {
    const { ask, click, full, nav, p } = h
    await nav(3); await ask('Freeze my card'); await ask('What do I owe?'); await full('owe')
    await click(/^Pay /); await h.confirm(); await full('paid')
    await ask('Where did my money go?'); await full('spend')
    await ask('I lost my card'); await full('lost'); await click('Send a replacement'); await h.confirm(); await full('replaced')
    await ask('Someone took money I don\'t recognise'); await full('fraud')
  },
  async points(h) {
    const { ask, click, full, nav, p } = h
    await nav(3); await ask('Transfer points to miles'); await full('programmes')
    await p.locator('.gr-ack input').first().check().catch(() => {}); await p.locator('.gr-answer').last().locator('.gr-btn').first().click(); await p.waitForTimeout(400); await full('member'); await p.locator('.gr-answer').last().locator('input.app-in').fill('NW4821930'); await p.locator('.gr-answer').last().locator('.gr-btn').last().click(); await p.waitForTimeout(400); await h.confirm(); await full('transferred')
    await ask('Put points into gold'); await p.locator('.gr-answer').last().locator('[role=switch]').last().click(); await click('Continue with the partner'); await h.confirm(); await full('invested')
    await ask('Donate points to charity'); await p.locator('.gr-answer').last().locator('.gr-btn').first().click(); await p.waitForTimeout(400); await h.confirm(); await full('donated')
    await ask('Ways to earn more'); await full('challenges')
  },
  async docs(h) {
    const { ask, full, nav, p } = h
    await nav(3); await ask(`Do I need a visa for ${CITY[mk()]}?`); await ask('Travel insurance'); await full('ins')
    await ask('eSIM for data abroad'); await p.locator('.gr-answer').last().locator('.ds-best-ph, .ds-irow, .gr-itemrow, .ds-orow-b, .ds-rtile').first().click(); await p.waitForTimeout(400); await full('esim')
    await payOrFree(h, 'esim')
  },
  async concierge(h) {
    const { ask, full, nav, p, click } = h
    await nav(3); await ask('Get me a table at a sold-out restaurant'); await full('form')
    await p.fill('.app-ta', (await p.evaluate(() => document.documentElement.dir)) === 'rtl' ? 'السبت، شخصان، حوالي الساعة 8 مساءً' : 'Saturday, 2 people, around 8pm'); await click('Send to the concierge'); await full('sent')
    await ask('What does my card cover?'); await full('benefits')
    await ask('I want to complain'); await full('handoff')
  },
  async problems(h) {
    const { ask, full, nav, p, click } = h
    await nav(5); await p.locator('.app-demo .gr-toggle, .app-demo [role=switch]').nth(0).click(); await nav(3)
    await buyFirst(h, 'Noise-cancelling headphones', 'rise').catch(() => {}); await full('price-rise')
    await click(/^Continue at/); await full('reopened'); await click(/^Pay /); await h.confirm(); await full('rise-paid')
    await nav(5); await p.locator('.app-demo [role=switch]').nth(2).click(); await nav(3)
    await ask('Noise-cancelling headphones'); await p.locator('.gr-answer').last().locator('.ds-best-ph, .ds-irow, .gr-itemrow, .ds-orow-b, .ds-rtile').first().click(); await p.waitForTimeout(300); await p.locator('.gr-answer').last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(300)
    await p.locator('.gr-answer').last().locator('.gr-opt,[role=radio]').last().click().catch(() => {}); await click(/^Pay /); await h.confirm(); await full('declined')
    await nav(5); await click('Suspicious payment'); await full('fraud')
    await ask('Can I order food delivery?'); await full('food')
    await ask('Book me a spaceship'); await full('unknown')
  },
}
module.exports.explore = async function (h) {
  const { p, nav, full } = h
  await nav(2)
  const n = await p.locator('.gr-cattile').count()
  for (let i = 0; i < n; i++) { await p.locator('.gr-cattile').nth(i).click(); await p.waitForTimeout(300); await full('cat' + String(i).padStart(2, '0')); await p.locator('.app-main [aria-label="Back"], .app-main .gr-ibtn').first().click(); await p.waitForTimeout(200) }
}

module.exports.manage = async function (h) {
  const { p, ask, click, full, nav, confirm } = h
  await nav(3)
  await buyFirst(h, 'Noise-cancelling headphones', 'hp')
  await ask('cancel my headphones'); await full('cancel-ask')
  await click('Yes, cancel'); await full('cancelled')
  const again = await p.getByRole('button', { name: 'Yes, cancel' }).count(); if (again) h.errs.push('CANCEL BUTTON STILL LIVE')
  await buyFirst(h, 'Rain shell jacket', 'jk')
  await ask('my jacket arrived damaged'); await full('claim-early')
  await nav(5); await click('Deliver my order'); await nav(3)
  await ask('my jacket arrived damaged'); await full('claim-form')
  await p.locator('.gr-answer').last().locator('button').nth(1).click().catch(() => {}); await click('Send claim'); await full('claim-sent')
  await nav(3); await ask('Flights to ' + ({ UK: 'Lisbon', EU: 'Rome', IN: 'Goa', AE: 'Muscat', AR: 'Muscat', SG: 'Bali', MY: 'Penang' })[process.argv[2] || 'UK'] + ' next weekend for two')
  await p.locator('.gr-answer').last().locator('.ds-fl').first().click(); await p.waitForTimeout(400); await click(/Continue with/); { const ins = p.locator('.gr-answer').last().locator('input.app-in'); for (let i = 0; i < await ins.count(); i++) { if (!(await ins.nth(i).inputValue())) await ins.nth(i).fill('Sam Taylor') } } await click('Continue', { exact: true }); await click('Continue', { exact: true }); await click(/^Pay /); await confirm(); await full('flight-booked')
  await ask('change my flight'); await full('change-ask')
  await p.locator('.gr-answer').last().locator('.gr-slot').nth(0).click(); await full('change-pick')
  await p.locator('.gr-answer').last().locator('.gr-btn').last().click(); await p.waitForTimeout(500); await full('change-next')
  const pay = p.getByRole('button', { name: /^(Pay |ادفع )/ }); if (await pay.count()) { await pay.last().click(); await confirm() } await full('changed')
  await ask('change my seat'); await p.locator('.gr-answer').last().locator('.gr-seat').nth(3).click().catch(() => {}); await click('Save seats'); await full('seats')
  await nav(4); await click(/Show pass|Boarding pass/); await full('passes')
  const bal0 = await p.evaluate(() => JSON.parse(localStorage.getItem('gratifi-state-v3-' + (new URLSearchParams(location.search).get('m')))).card.balance)
  console.log('card balance after all', bal0)
}

/* Card modules: every servicing screen, end to end, then switching bank APIs off. */
module.exports.cards = async function (h) {
  const { p, shot, click, confirm, errs, ask } = h
  const S = () => p.evaluate(() => JSON.parse(localStorage.getItem('gratifi-state-v3-' + (new URLSearchParams(location.search).get('m') || 'UK'))))
  const go = async (t, c) => { await p.keyboard.press('Escape'); await p.evaluate(([t, c]) => window.__go(t, c), [t, c]); await p.waitForTimeout(500) }
  const check = (ok, what) => { if (!ok) errs.push('CHECK ' + what) }
  const tab = () => p.evaluate(() => window.__tab)
  await go('card'); await shot('card')
  // pay the bill in full and stay on the screen
  await go('cardx', 'pay'); await shot('pay'); await click(/^(Pay |ادفع )/); await confirm(); await p.waitForTimeout(2400)
  check((await S()).card.due === 0, 'bill paid'); check(await tab() === 'cardx', 'pay stays on screen'); await shot('paid')
  // statements and a download
  await go('cardx', 'statements'); await p.locator('.ds-row').nth(1).click(); await p.waitForTimeout(500); await shot('statement')
  // transactions: search, open one
  await go('cardx', 'txns'); await p.fill('.ds-search input', 'Pantry'); await p.waitForTimeout(300); check(await p.locator('.ds-txn').count() >= 1, 'search finds Pantry'); await shot('txns')
  await p.locator('.ds-txn').first().click(); await p.waitForTimeout(500); await shot('txn')
  // card details behind a check
  await go('cardx', 'details'); await click('Show card details'); await confirm(); await p.waitForTimeout(2400)
  const num = (await p.locator('.ds-num').first().innerText()).replace(/\D/g, '')
  const luhn = n => n.split('').reverse().reduce((a, d, i) => { let x = +d; if (i % 2) { x *= 2; if (x > 9) x -= 9 } return a + x }, 0) % 10 === 0
  check(num.length === 16 && luhn(num), 'card number shown and valid'); await shot('details')
  await go('cardx', 'pin'); await click('Show PIN'); await confirm(); await p.waitForTimeout(2400); check(/\d/.test(await p.locator('.ds-hero-v').first().innerText()), 'PIN shown'); await shot('pin')
  // a dining limit that blocks a payment
  await go('cardx', 'limits'); await p.locator('.ds-limit .ds-opill').first().click(); await p.fill('.ds-field input', '20'); await click('Save'); await p.waitForTimeout(300)
  check((await S()).seen.catLimits?.Dining === 20, 'dining limit saved'); await shot('limits')
  await go('me'); await click('A card payment'); check(/monthly limit/.test(JSON.stringify((await S()).chat.slice(-1))), 'limit declines a payment')
  // lost card: freeze, order, deliver, activate
  await go('cardx', 'lost'); await click('Freeze my card'); check((await S()).card.frozen, 'frozen from lost screen')
  await p.getByRole('radio').nth(1).click(); await click('Order a new card'); await confirm(); await p.waitForTimeout(2400); await shot('ordered')
  check((await S()).bookings.some(b => b.extra?.case === 'replacement'), 'replacement ordered')
  await go('me'); await click('New card arrives'); await p.waitForTimeout(600); check(await tab() === 'cardx', 'goes to activate')
  const want = await p.evaluate(() => (document.querySelector('.app-hint')?.textContent || '').match(/(\d{4})/)?.[1])
  await p.locator('.ds-field input').nth(0).fill(want || '0000'); await p.locator('.ds-field input').nth(1).fill('0929'); await shot('activate'); await click('Activate'); await p.waitForTimeout(600)
  { const s = await S(); check(s.card.last4 === want && !s.card.frozen, 'new card active') }
  // dispute
  await go('cardx', 'dispute'); await p.locator('.ds-txn').nth(1).click(); await p.waitForTimeout(400); await shot('dispute'); await click('Review and send'); await confirm(); await p.waitForTimeout(2400)
  check((await S()).bookings.some(b => b.extra?.case === 'dispute'), 'dispute sent'); await shot('disputed')
  // higher limit, then the bank decides
  await go('cardx', 'limit'); await p.getByRole('radio').first().click(); await click('Send to the bank'); await confirm(); await p.waitForTimeout(2400)
  const lim0 = (await S()).card.limit; await go('me'); await click('Bank decides cases'); await p.waitForTimeout(500); check((await S()).card.limit > lim0, 'limit approved'); await shot('cases')
  // phone wallet and travel notice
  await go('cardx', 'wallet'); await p.locator('.ds-row .ds-opill').first().click(); await confirm(); await p.waitForTimeout(2400); check(Object.keys((await S()).seen.wallets || {}).length === 1, 'wallet added'); await shot('wallet')
  await go('cardx', 'travel'); await p.locator('.ds-field input').first().fill('Lisbon'); await click('Add travel notice'); await p.waitForTimeout(300); check(((await S()).seen.notices || []).length === 1, 'travel notice'); await shot('travel')
  // switch APIs off: screens, Home and answers follow
  await go('me')
  await p.evaluate(() => (window).__setApis?.({ 'cards.pin': true, 'partners.travel': true }))
  await go('card'); check(!(await p.getByRole('button', { name: /^(PIN|رمز PIN)$/ }).count()), 'PIN row hidden'); await shot('card-nopin')
  await go('home'); await shot('home-notravel')
  await ask('Flights to ' + ({ UK: 'Lisbon', EU: 'Rome', IN: 'Goa', AE: 'Muscat', AR: 'Muscat', SG: 'Bali', MY: 'Penang' })[process.argv[2] || 'UK'] + ' next weekend'); await p.waitForTimeout(800)
  { const last = (await S()).chat.filter(m => m.role === 'gr').pop() || {}; check(!(last.blocks || []).some(b => b.kind === 'flights') && /n't available/.test(last.text || ''), 'no flights when travel off: ' + (last.text || '').slice(0, 80)) } await shot('chat-noflights')
  await p.evaluate(() => (window).__setApis?.({}))
}
