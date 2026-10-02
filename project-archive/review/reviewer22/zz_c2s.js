const id=(r,i=0)=>JSON.stringify(r).match(/"id":"([^"]+)"/g)[i].slice(6,-1);
module.exports=[
{name:'train today past slot', q:'train to Manchester today at 7:30', plan: async (t,o,run)=>{const r=await run('search_catalogue',{category:'rides',query:'train to Manchester'}); window.__r=r; const x=JSON.stringify(r).match(/"id":"(GT-[^"]+)","title":"Train[^"]*"/); await run('prepare_checkout',{id:x[1], option:'07:30', date:'2026-09-30'}); return 'Confirm below.'}},
{name:'experience today past slot', q:'food tour today 9am', plan: async (t,o,run)=>{const r=await run('search_catalogue',{category:'experiences',city:'London'}); const ids=JSON.stringify(r).match(/EX-[^"]+/g); await run('show_item',{id:ids[0]}); await run('prepare_checkout',{id:ids[0], option:'09:00', date:'2026-09-30'}); return 'Confirm below.'}},
{name:'shirt no size', q:'buy a shirt', plan: async (t,o,run)=>{const r=await run('search_catalogue',{category:'shopping',query:'shirt'}); const ids=JSON.stringify(r).match(/"id":"([^"]+)"/g).map(x=>x.slice(6,-1)); window.__ids=ids; for (const i of ids.slice(0,4)) await run('prepare_checkout',{id:i}); return 'Here.'}},
];
