module.exports = [
  { say: 'hotels lisbon 3 nights 9 oct 3 guests', plan: "async(t,o,run)=>{ await run('search_catalogue',{category:'stays',city:'Lisbon',date:'2026-10-09',nights:3,guests:3}); return 'Here.' }", dump: 1 },
  { say: 'show the first', plan: "async(t,o,run)=>{ await run('show_item',{id:'ST-Lisbon-0',date:'2026-10-09',nights:3,guests:3}); return 'Here.' }", dump: 1 },
  { say: 'suite please', plan: "async(t,o,run)=>{ await run('prepare_checkout',{id:'ST-Lisbon-0',date:'2026-10-09',nights:3,quantity:3,option:'Suite'}); return 'Ready.' }", dump: 1 },
  { say: 'double rooms please', plan: "async(t,o,run)=>{ await run('prepare_checkout',{id:'ST-Lisbon-0',date:'2026-10-09',nights:3,quantity:3}); return 'Ready.' }", dump: 1 },
  { say: 'tomorrow for 1 night', plan: "async(t,o,run)=>{ await run('prepare_checkout',{id:'ST-Lisbon-0',date:'2026-10-02',nights:1,quantity:2}); return 'Ready.' }", dump: 1 },
];
