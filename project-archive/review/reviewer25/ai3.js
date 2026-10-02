const run = require('./h.js'); const m = process.argv[2] || 'UK';
const plan = async (h, fnSrc, q, w = 1000) => { await h.p.evaluate(src => { window.__plan = eval(src) }, fnSrc); await h.ask(q, w); return await h.p.evaluate(() => JSON.stringify((window.__res || []).map(x => typeof x === 'string' ? x : { n: x.n, a: x.a, s: x.r && x.r.shown_to_customer, note: x.r && x.r.note })).slice(0, 700)) };
const C = [
  ['GC-0', {option:'37', email:'sam@example.com', recipient:'Sam'}],
  ['GC-0', {option:'50', recipient:'Sam'}],
  ['GC-0', {option:'50', recipient:'Sam', email:'not-an-email'}],
  ['GC-0', {option:'50', recipient:'Sam', email:'sam@example.com'}],
  ['SH-4', {}],
  ['SH-4', {option:'XXL'}],
  ['SH-4', {option:'M'}],
  ['SH-1', {quantity:0}],
  ['SH-1', {quantity:2.5}],
  ['SH-1', {quantity:40}],
  ['SH-3', {quantity:9}],
  ['DN-London-0', {quantity:14, option:'19:30'}],
  ['DN-London-0', {quantity:4, option:'19:30', date:'2026-09-29'}],
  ['DN-London-0', {quantity:4, option:'03:00'}],
  ['DN-London-0', {quantity:4, option:'19:30'}],
  ['ST-Lisbon-0', {nights:45}],
  ['ST-Lisbon-0', {nights:3, quantity:5}],
  ['ST-Lisbon-0', {nights:3, quantity:5, rooms:1}],
  ['ST-Lisbon-0', {nights:2, option:'Suite', quantity:3, date:'2026-10-09'}],
  ['AP-1', {quantity:4}],
  ['GT-1', {destination:'Heathrow', pickup_time:'25:00', date:'2026-10-02'}],
  ['GT-1', {destination:'Heathrow', pickup_time:'06:00', date:'2026-09-30'}],
  ['GT-1', {destination:'Heathrow', pickup_time:'18:00', date:'2026-10-02'}],
  ['GT-1', {destination:'office'}],
  ['GT-1', {destination:'Camden'}],
  ['GT-4', {days:4}],
  ['GT-4', {days:5}],
  ['GT-6', {quantity:3}],
  ['ET-4', {quantity:3}],
  ['ET-4', {quantity:2, date:'2026-09-28'}],
  ['ET-1', {quantity:2}],
  ['SB-1', {}],
  ['SB-2', {}],
  ['EX-London-0', {quantity:2, date:'2026-09-01'}],
];
run(`ai3-${m}`, m, async h => {
  const { p, lastText, log, nav } = h;
  await nav(3);
  for (const [id, a] of C) {
    const r = await plan(h, `async (t,o,run)=>{ await run('prepare_checkout',${JSON.stringify({ id, ...a })}); return '' }`, 'x ' + id);
    const sheet = await p.$('.app-sheet'); if (sheet) { log('!!SHEET OPEN'); await p.keyboard.press('Escape'); }
    log(id, JSON.stringify(a), '=>', r.slice(0, 420), '|| CARD:', (await lastText()).slice(0, 330));
  }
}, { ai: true });
