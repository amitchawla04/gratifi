module.exports = [
 { q: 'buy the jacket size M', plan: `await run('prepare_checkout', {id:'SH-4', option:'M'}); return 'Confirm with the button.'`, after: `await h.click(/^Pay /); await h.confirm(); console.log('  bought')` },
 { q: 'what have I got', plan: `const r = await run('my_bookings', {}); window.__bid = r.data && (r.data[0]?.id || r.data.bookings?.[0]?.id); return 'Your Rain shell jacket is ordered and arrives Friday.'` },
 { q: 'cancel the jacket', plan: `const r = await run('my_bookings', {}); const id = (r.data[0] || r.data.bookings[0]).id; await run('manage_booking', {booking_id: id, action:'cancel'}); return "I've cancelled your jacket and refunded 12,000 points."` },
 { q: 'yes cancel it', plan: `return "Your jacket order is cancelled and your points are back."`, },
 { q: 'I have a problem with my partner taking my money', plan: `await run('talk_to_person', {reason:'partner taking my money', vulnerable:true}); return 'A specialist can help.'` },
 { q: 'my payment to Amazon was taken twice', plan: `await run('card_and_account', {topic:'a payment was taken twice'}); return 'ok'` },
 { q: 'can I get cash out abroad without fees', plan: `await run('card_and_account', {topic:'cash withdrawal abroad fees'}); return 'ok'` },
 { q: 'what is my APR', plan: `await run('card_and_account', {topic:'interest rate APR'}); return 'ok'` },
]
