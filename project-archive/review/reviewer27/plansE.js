const P = (s) => `async (turns,o,run) => { ${s} }`
module.exports = [
 { q: 'hotels lisbon 3 nights 3 guests', plan: P(`const s = await run('search_catalogue', {category:'stays', city:'Lisbon', nights:3, guests:3}); window.__s = s.data; return 'x'`), post: async (h) => console.log('  LIST DATA', await h.p.evaluate(() => JSON.stringify(window.__s).slice(0, 400))) },
 { q: 'show tidewater', plan: P(`await run('show_item', {id:'ST-Lisbon-0', nights:3, guests:3}); return 'x'`) },
 { q: 'checkout tidewater', plan: P(`await run('prepare_checkout', {id:'ST-Lisbon-0', nights:3, quantity:3}); return 'x'`) },
 { q: 'checkout tidewater tomorrow', plan: P(`await run('prepare_checkout', {id:'ST-Lisbon-0', nights:3, quantity:3, date:'2026-10-01'}); return 'x'`) },
 { q: 'lounge 2 people date in past', plan: P(`await run('prepare_checkout', {id:'AP-1', quantity:2, date:'2026-09-01'}); return 'x'`) },
 { q: 'experience walking tour 0 people', plan: P(`await run('prepare_checkout', {id:'EX-London-0', quantity:-2}); return 'x'`) },
 { q: 'experience walking tour 1.5 people', plan: P(`await run('prepare_checkout', {id:'EX-London-0', quantity:1.5}); return 'x'`) },
 { q: 'gift card for me', plan: P(`await run('prepare_checkout', {id:'GC-3', option:'25', recipient:'me'}); return 'x'`) },
 { q: 'ride with pickup home to airport', plan: P(`await run('prepare_checkout', {id:'GT-2', pickup:'home', destination:'airport'}); return 'x'`) },
 { q: 'ride from office to 10 Downing Street', plan: P(`await run('prepare_checkout', {id:'GT-1', pickup:'office', destination:'10 Downing Street'}); return 'x'`) },
 { q: 'airport transfer to Gatwick', plan: P(`await run('prepare_checkout', {id:'GT-3', destination:'Gatwick'}); return 'x'`) },
]
