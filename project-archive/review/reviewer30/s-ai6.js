module.exports = async (H) => { const { p, nav } = H; const T = require('./ailib.js')(H); await nav(3); await p.waitForTimeout(500);
 await T('stay 31 nov', `async (t,o,run)=>{ await run('prepare_checkout',{id:'ST-Lisbon-0',nights:2,date:'2026-11-31',quantity:2}); return 'Confirm.' }`, { len: 250 });
 await T('flight 31 nov', `async (t,o,run)=>{ await run('search_flights',{destination:'Lisbon',depart_date:'2026-11-31'}); return 'Here.' }`, { len: 250 });
 await T('table 31 nov', `async (t,o,run)=>{ await run('prepare_checkout',{id:'DN-London-0',option:'19:30',quantity:2,date:'2026-11-31'}); return 'Confirm.' }`, { len: 250 });
 await T('search stays 2026-13-01', `async (t,o,run)=>{ await run('search_catalogue',{category:'stays',city:'Lisbon',date:'2026-13-01'}); return 'x' }`, { len: 250 });
}
