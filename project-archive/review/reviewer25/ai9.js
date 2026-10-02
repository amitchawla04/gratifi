const run = require('./h.js'); const m = process.argv[2] || 'UK';
const plan = async (h, fnSrc, q, w = 1000) => { await h.p.evaluate(src => { window.__plan = eval(src) }, fnSrc); await h.ask(q, w); const sh = await h.p.$('.app-sheet'); let st = ''; if (sh) { st = ' [SHEET]'; await h.p.keyboard.press('Escape') } return (await h.p.evaluate(() => JSON.stringify((window.__res || []).map(x => typeof x === 'string' ? x : { n: x.n, s: x.r && x.r.shown_to_customer, note: x.r && x.r.note })).slice(0, 400))) + st };
run(`ai9-${m}`, m, async h => {
  const { log, nav } = h; await nav(3);
  log('1', await plan(h, `async (t,o,run)=>{ await run('prepare_checkout',{id:'FL-LIS-2026-10-09-1-o'}); return '' }`, 'a'));
  log('2', await plan(h, `async (t,o,run)=>{ await run('show_item',{id:'ZZ-99'}); return '' }`, 'b'));
  log('3', await plan(h, `async (t,o,run)=>{ await run('manage_booking',{booking_id:'nope',action:'cancel'}); return '' }`, 'c'));
  log('4', await plan(h, `async (t,o,run)=>{ await run('choose_flight',{flight_id:'FL-XXX'}); return '' }`, 'd'));
  log('5', await plan(h, `async (t,o,run)=>{ await run('search_catalogue',{category:'stays',city:'Lisbon',date:'2026-10-09',nights:3,guests:2}); await run('prepare_checkout',{id:'ST-Lisbon-0',date:'2026-10-09',nights:3,quantity:2}); return 'Confirm with the button.' }`, 'e'));
  log('6', await plan(h, `async (t,o,run)=>{ await run('prepare_checkout',{id:'ST-Lisbon-0',date:'2027-12-01',nights:2}); return '' }`, 'f'));
  log('7', await plan(h, `async (t,o,run)=>{ await run('search_flights',{destination:'Lisbon',depart_date:'2027-12-01'}); return '' }`, 'g'));
  log('8', await plan(h, `async (t,o,run)=>{ await run('prepare_checkout',{id:'SH-1',quantity:-3}); return '' }`, 'h'));
  log('9', await plan(h, `async (t,o,run)=>{ await run('prepare_checkout',{id:'GC-1',option:'50',email:'a@b.co'}); return '' }`, 'i'));
}, { ai: true });
