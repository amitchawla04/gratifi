module.exports=[
{name:'train past', q:'train to Manchester today at 7:30', plan: async (t,o,run)=>{const r=await run('prepare_checkout',{id:'GT-R1', option:'07:30', date:'2026-09-30'}); return JSON.stringify(r).slice(0,300)}},
{name:'exp past', q:'food tour today 9am', plan: async (t,o,run)=>{const r=await run('prepare_checkout',{id:'EX-London-0', option:'09:00', date:'2026-09-30'}); return JSON.stringify(r).slice(0,300)}},
{name:'jacket', q:'buy a jacket', plan: async (t,o,run)=>{const r=await run('prepare_checkout',{id:'SH-4'}); return JSON.stringify(r).slice(0,300)}},
{name:'gift no to', q:'gift card', plan: async (t,o,run)=>{const r=await run('prepare_checkout',{id:'GC-2', option:'50'}); return JSON.stringify(r).slice(0,300)}},
{name:'fraction', q:'flights', plan: async (t,o,run)=>{const r=await run('search_flights',{destination:'Lisbon', depart_date:'2026-10-09', travellers:2.5}); return JSON.stringify(r).slice(0,300)}},
{name:'claim mix', q:'freeze my card and pay my bill', plan: async (t,o,run)=>{await run('card_control',{action:'freeze'}); await run('card_and_account',{topic:'pay my bill'}); return "I've frozen your card and paid your bill of £906.98. Your limit is now £5,000."}},
];
