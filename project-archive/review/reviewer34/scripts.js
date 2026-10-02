const CITY = { UK: 'Lisbon', EU: 'Rome', IN: 'Goa', AE: 'Muscat', AR: 'Muscat', SG: 'Bali', MY: 'Penang' }
const mk = () => process.argv[2] || 'UK'
async function payOrFree(h, tag) {
  const { p, click, confirm, full } = h
  await p.waitForTimeout(300)
  const pay = p.getByRole('button', { name: /^(Pay |ادفع )/ }).last()
  if (await pay.count()) { await pay.scrollIntoViewIfNeeded(); await pay.click(); await confirm(); await full(tag + '-done'); return }
  const free = p.locator('.gr-answer').last().locator('.gr-card .gr-btn:not([disabled])').last()
  if (!(await free.count())) { await full(tag + '-done'); return }
  await free.scrollIntoViewIfNeeded(); await free.click(); await p.waitForTimeout(500); await full(tag + '-done')
}
async function buyFirst(h, q, tag, nth = 0, pre) {
  const { p, ask, full } = h
  await ask(q); await full(tag + '-list')
  await p.locator('.gr-answer').last().locator('.gr-itemrow').nth(nth).click(); await p.waitForTimeout(400)
  if (pre) await pre()
  { const b = p.locator('.gr-answer').last().locator('.gr-detail .gr-btn').last(); if (/Pick a size|اختر المقاس/.test(await b.innerText().catch(() => ''))) { await p.locator('.gr-answer').last().locator('.gr-chip').nth(1).click(); await p.waitForTimeout(150) } }
  await full(tag + '-detail')
  const cta = p.locator('.gr-answer').last().locator('.gr-detail .gr-btn').last(); await cta.scrollIntoViewIfNeeded(); await cta.click(); await p.waitForTimeout(400)
  await full(tag + '-checkout'); await payOrFree(h, tag)
}
module.exports = {
  async tabs({ full, nav }) { await full('home'); await nav(2); await full('explore'); await nav(3); await full('chat'); await nav(4); await full('wallet'); await nav(5); await full('me') },
  async flight(h) {
    const { ask, click, full, confirm, nav, p } = h
    await nav(3); await ask(`Flights to ${CITY[mk()]} next weekend for two`); await full('results')
    await p.locator('.gr-flight').first().click(); await p.waitForTimeout(400); await full('fares')
    await click(/Continue with/); await full('seats')
    { const ins = p.locator('.gr-answer').last().locator('input.app-in'); for (let i = 0; i < await ins.count(); i++) { if (!(await ins.nth(i).inputValue())) await ins.nth(i).fill('Sam Taylor') } } await click('Continue', { exact: true }); await full('checkout')
    await click(/^Pay /); await confirm(); await full('receipt')
    await ask('Only direct'); await ask('Cheaper dates?'); await full('followups')
    await nav(4); await full('wallet')
    await click(/Show pass|Boarding pass/); await full('pass')
    await nav(5); await click('Cancel my next flight'); await full('disruption')
    await click('Move to this flight', { exact: true }); await full('rebooked')
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
    await ask('Put points into gold'); await p.locator('.gr-ack input').last().check(); await click('Continue with the partner'); await h.confirm(); await full('invested')
    await ask('Donate points to charity'); await p.locator('.gr-answer').last().locator('.gr-btn').first().click(); await p.waitForTimeout(400); await h.confirm(); await full('donated')
    await ask('Ways to earn more'); await full('challenges')
  },
  async docs(h) {
    const { ask, full, nav, p } = h
    await nav(3); await ask(`Do I need a visa for ${CITY[mk()]}?`); await ask('Travel insurance'); await full('ins')
    await ask('eSIM for data abroad'); await p.locator('.gr-answer').last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(400); await full('esim')
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
    await ask('Noise-cancelling headphones'); await p.locator('.gr-answer').last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(300); await p.locator('.gr-answer').last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(300)
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
  await p.locator('.gr-flight').first().click(); await p.waitForTimeout(400); await click(/Continue with/); { const ins = p.locator('.gr-answer').last().locator('input.app-in'); for (let i = 0; i < await ins.count(); i++) { if (!(await ins.nth(i).inputValue())) await ins.nth(i).fill('Sam Taylor') } } await click('Continue', { exact: true }); await click(/^Pay /); await confirm(); await full('flight-booked')
  await ask('change my flight'); await full('change-ask')
  await p.locator('.gr-answer').last().locator('.gr-slot').nth(0).click(); await full('change-pick')
  await p.locator('.gr-answer').last().locator('.gr-btn').last().click(); await p.waitForTimeout(500); await full('change-next')
  const pay = p.getByRole('button', { name: /^(Pay |ادفع )/ }); if (await pay.count()) { await pay.last().click(); await confirm() } await full('changed')
  await ask('change my seat'); await p.locator('.gr-answer').last().locator('.gr-seat').nth(3).click().catch(() => {}); await click('Save seats'); await full('seats')
  await nav(4); await click(/Show pass|Boarding pass/); await full('passes')
  const bal0 = await p.evaluate(() => JSON.parse(localStorage.getItem('gratifi-state-v3-' + (new URLSearchParams(location.search).get('m')))).card.balance)
  console.log('card balance after all', bal0)
}
