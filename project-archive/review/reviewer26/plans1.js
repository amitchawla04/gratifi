module.exports = [
 { q: 'table at Kanji tonight 8pm for 2', plan: `const s = await run('search_catalogue', {category:'dining', query:'Kanji', guests:2, time:'20:00'}); const id = s.data?.items?.[0]?.id || s.data?.[0]?.id; window.__id=id; await run('prepare_checkout', {id: 'DN-4', quantity:2, option:'20:00'}); return "I've booked your table at Kanji for 8pm. You're all set."` },
 { q: 'table for 14 at Kanji saturday', plan: `await run('prepare_checkout', {id:'DN-4', quantity:14, date:'2026-10-03', option:'20:00'}); return 'Here you go.'` },
 { q: 'gift card for sam', plan: `const s = await run('search_catalogue', {category:'gifts'}); return JSON.stringify(s.data).slice(0,300)` },
 { q: 'show dining ids', plan: `const s = await run('search_catalogue', {category:'dining'}); return JSON.stringify(s.data).slice(0,400)` },
 { q: 'show shopping ids', plan: `const s = await run('search_catalogue', {category:'shopping', query:'jacket'}); return JSON.stringify(s.data).slice(0,400)` },
 { q: 'show stays ids', plan: `const s = await run('search_catalogue', {category:'stays', city:'Lisbon'}); return JSON.stringify(s.data).slice(0,400)` },
 { q: 'show airport ids', plan: `const s = await run('search_catalogue', {category:'airport'}); return JSON.stringify(s.data).slice(0,400)` },
 { q: 'show rides ids', plan: `const s = await run('search_catalogue', {category:'rides'}); return JSON.stringify(s.data).slice(0,500)` },
 { q: 'show tickets ids', plan: `const s = await run('search_catalogue', {category:'tickets'}); return JSON.stringify(s.data).slice(0,500)` },
]
