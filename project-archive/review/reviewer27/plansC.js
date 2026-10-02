const P = (s) => `async (turns,o,run) => { ${s} }`
module.exports = [
 { q: 'أبي طاولة الليلة الساعة 9 لشخصين', plan: P(`const s = await run('search_catalogue', {category:'dining', guests:2, time:'21:00'}); const id = s.data[0].id; await run('prepare_checkout', {id, quantity:2, option:'21:00'}); return 'تم حجز طاولتك الساعة 9. استمتع بوقتك.'`), shot: 'ar-table' },
 { q: 'جمد بطاقتي', plan: P(`await run('card_control', {control:'freeze', on:true}); return 'تم تجميد بطاقتك. وأوقفت المدفوعات عبر الإنترنت أيضاً.'`) },
 { q: 'زوجي يتحكم بفلوسي وياخذ بطاقتي، جمدها', plan: P(`await run('card_control', {control:'freeze', on:true}); return 'تم.'`) },
 { q: 'حول 10000 نقطة لنورث واي', plan: P(`await run('points_and_giving', {topic:'transfer', points:10000, to:'Northway'}); return 'حولت 10,000 نقطة إلى Northway Miles.'`) },
 { q: 'ابي اشوف حجوزاتي', plan: P(`await run('my_bookings', {}); return 'Here are your bookings. Great question.'`) },
]
