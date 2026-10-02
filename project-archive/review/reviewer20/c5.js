module.exports = [
 { say: 'رحلات إلى مسقط', plan: `async (t,o,run) => { await run('search_flights', { destination: 'Muscat', depart_date: '2026-10-12', travellers: 2 }); return 'تم حجز رحلتك إلى مسقط.' }` },
 { js: () => [...document.querySelectorAll('.gr-answer')].pop().innerText.slice(0, 300) },
 { say: 'جمد بطاقتي', plan: `async (t,o,run) => { return 'جمّدت بطاقتك.' }` },
 { js: () => [...document.querySelectorAll('.gr-answer')].pop().innerText.slice(0, 300) },
 { say: 'حجز فندق', plan: `async (t,o,run) => { await run('search_catalogue', { category: 'stays', city: 'London' }); return 'حجزت لك فندق في لندن وخصمت المبلغ من بطاقتك.' }` },
 { js: () => [...document.querySelectorAll('.gr-answer')].pop().innerText.slice(0, 300) },
 { say: 'هل حجزت', plan: `async (t,o,run) => { return 'Your hotel is booked and paid.' }` },
 { js: () => [...document.querySelectorAll('.gr-answer')].pop().innerText.slice(0, 300) },
 { say: 'check rules', plan: `async (t,o,run) => { window.__rules = t[0].content; return 'ok' }` },
 { js: () => window.__rules.slice(-900) },
]
