const P = (calls, text) => `async (t,o,run) => { ${calls.map(c => `await run(${JSON.stringify(c[0])}, ${JSON.stringify(c[1])});`).join(' ')} return ${JSON.stringify(text)} }`
const pay = async (h) => { const b = h.p.getByRole('button', { name: /^Pay / }).last(); if (await b.count()) { await b.scrollIntoViewIfNeeded(); await b.click(); await h.confirm() } else h.log('NO PAY BUTTON') }
module.exports = [
  // Buy a train ticket through AI, then pay with the button
  { q: 'train to edinburgh on 5 Oct for 2', plan: P([['prepare_checkout', { id: 'GT-6', quantity: 2, date: '2026-10-05' }]], 'Confirm with the button.'), post: pay },
  { q: 'cancel my train', plan: P([['my_bookings', {}]], 'Here are your bookings.') },
  { q: 'yes cancel the train', plan: `async (t,o,run) => { const r = await run('my_bookings', {}); const id = (r.data||[])[0]?.id || (r.data && r.data.bookings && r.data.bookings[0].id); await run('manage_booking', {booking_id: id, action: 'cancel'}); return 'Your train to Edinburgh is cancelled and the points are back in your balance.' }`, shot: true },
  { q: 'variant 2', plan: `async (t,o,run) => { const r = await run('my_bookings', {}); const id = (r.data||[])[0]?.id; await run('manage_booking', {booking_id: id, action: 'cancel'}); return 'Done, your refund of £84 is on its way.' }` },
  { q: 'variant 3', plan: `async (t,o,run) => { const r = await run('my_bookings', {}); const id = (r.data||[])[0]?.id; await run('manage_booking', {booking_id: id, action: 'change date'}); return 'Your train now leaves on 6 October.' }` },
  { q: 'variant 4 arabic', plan: `async (t,o,run) => { const r = await run('my_bookings', {}); const id = (r.data||[])[0]?.id; await run('manage_booking', {booking_id: id, action: 'cancel'}); return 'ألغيت حجز القطار واسترجعت النقاط.' }` },
  { q: 'variant 5', plan: P([['search_catalogue', { category: 'dining' }]], 'Your table at Harrow & Vine is confirmed for 8pm.') },
  { q: 'variant 6', plan: P([['search_catalogue', { category: 'dining' }]], 'Great news, Harrow & Vine has you down for 8pm tonight.') },
  // card controls
  { q: 'turn off online payments', plan: P([['card_control', { control: 'online', on: false }]], 'Online payments are off now.') },
  { q: 'turn on online payments', plan: P([['card_control', { control: 'online', on: true }]], 'Online payments are back on.'), shot: true },
  { q: 'turn on cash withdrawals', plan: P([['card_control', { control: 'atm', on: true }]], 'Cash withdrawals are on.') },
  { q: 'freeze my card', plan: P([['card_control', { control: 'freeze', on: true }]], 'I have frozen your card.') },
  { q: 'unfreeze my card', plan: P([['card_control', { control: 'freeze', on: false }]], 'I have unfrozen your card.'), shot: true },
  { q: 'block gambling', plan: P([['card_control', { control: 'gambling', on: true }]], 'Gambling payments are blocked now.'), shot: true },
  { q: 'lift gambling block', plan: P([['card_control', { control: 'gambling', on: false }]], 'I have lifted the gambling block.'), shot: true },
  { q: 'lower my limit to 3000', plan: P([['card_and_account', { topic: 'lower my limit to 3000' }]], 'Your limit is now £3,000.'), shot: true },
  { q: 'transfer 999999 points', plan: P([['points_and_giving', { topic: 'transfer', points: 999999, to: 'Northway' }]], 'ok') },
  { q: 'transfer 5000 to northway', plan: P([['points_and_giving', { topic: 'transfer', points: 5000, to: 'Northway' }]], 'I have transferred 5,000 points.'), shot: true },
  { q: 'invest 5000 in gold', plan: P([['points_and_giving', { topic: 'invest', points: 5000, to: 'gold' }]], 'Tick the box and confirm.'), shot: true },
  { q: 'remind me when points expire', plan: P([['set_alert', { what: 'when my points are about to expire' }]], 'Done, I will remind you.') },
  { q: 'i took too many pills', plan: P([['talk_to_person', { reason: 'i took too many pills', at_risk: true }]], 'Please call 999 now.'), shot: true },
]
