const fs=require('fs');
(async()=>{
const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: 420, height: 880 } }); await ctx.addInitScript({ content: fs.readFileSync('fake.js','utf8') });
const m = process.argv[2]||'UK';
const p = await ctx.newPage(); const url=`file://${__dirname}/build/test.html?m=${m}&tab=chat`;
p.on('pageerror', e=>console.log('PAGEERR', e.message));
await p.goto(url); await p.evaluate(()=>localStorage.clear()); await p.goto(url); await p.waitForTimeout(600);
const st = () => p.evaluate(()=>JSON.parse(localStorage.getItem(Object.keys(localStorage).find(k=>k.startsWith('gratifi-state')))));
const run = async (label, calls, text='OK.') => {
  await p.evaluate(({calls,text})=>{ window.__plan = () => ({ calls, text }) }, {calls,text});
  const s0 = (await st()) || {card:{},balance:0};
  await p.fill('.gr-ask input', label); await p.press('.gr-ask input','Enter'); await p.waitForTimeout(700);
  const s1 = await st(); const msg = s1.chat[s1.chat.length-1];
  const sheet = await p.evaluate(()=>document.querySelector('.app-sheet')?.innerText.replace(/\n/g,' / ').slice(0,200) || '');
  const res = await p.evaluate(()=>JSON.stringify(window.__results).slice(0,400));
  console.log(`== ${label}\n  blocks: ${(msg.blocks||[]).map(b=>b.kind).join(',')} | text: ${(msg.text||'').slice(0,120)}\n  sheet: ${sheet}\n  result: ${res}\n  bal ${s0.card.balance}->${s1.card.balance} pts ${s0.balance}->${s1.balance} frozen ${s1.card.frozen} ctrls ${JSON.stringify(s1.card.controls||'')}`);
  if (sheet) { await p.locator('.app-sheet [aria-label=Close]').first().click().catch(()=>{}); await p.waitForTimeout(300) }
};
await run('ai freeze', [{tool:'card_control', args:{control:'freeze', on:true}}]);
await run('ai unfreeze', [{tool:'card_control', args:{control:'freeze', on:false}}]);
await run('ai online on', [{tool:'card_control', args:{control:'online', on:true}}]);
await run('ai online off', [{tool:'card_control', args:{control:'online', on:false}}]);
await run('ai atm on', [{tool:'card_control', args:{control:'atm', on:true}}]);
await run('ai transfer', [{tool:'points_and_giving', args:{topic:'transfer', points:20000, to:'Northway'}}]);
await run('ai transfer too many', [{tool:'points_and_giving', args:{topic:'transfer', points:9000000, to:'Northway'}}]);
await run('ai donate neg', [{tool:'points_and_giving', args:{topic:'donate', points:-500, to:'Clean'}}]);
await run('ai invest', [{tool:'points_and_giving', args:{topic:'invest', points:5000, to:'gold'}}]);
await run('ai flights past', [{tool:'search_flights', args:{destination:'Lisbon', depart_date:'2026-09-01'}}]);
await run('ai flights inf>adults', [{tool:'search_flights', args:{destination:'Lisbon', depart_date:'2026-10-16', travellers:1, infants:3}}]);
await run('ai flights 30 pax', [{tool:'search_flights', args:{destination:'Lisbon', depart_date:'2026-10-16', travellers:30}}]);
await run('ai flights back before', [{tool:'search_flights', args:{destination:'Lisbon', depart_date:'2026-10-16', return_date:'2026-10-10'}}]);
await run('ai flights bad city', [{tool:'search_flights', args:{destination:'Atlantis'}}]);
await run('ai flights weird date', [{tool:'search_flights', args:{destination:'Lisbon', depart_date:'16/10/2026'}}]);
await run('ai choose bad id', [{tool:'choose_flight', args:{flight_id:'FL-XXX'}}]);
await run('ai choose kids>pax', [{tool:'choose_flight', args:{flight_id:'FL-LIS-2026-10-16-1-o', travellers:1, children:3}}]);
await run('ai checkout bad', [{tool:'prepare_checkout', args:{id:'nope'}}]);
await run('ai dining 40', [{tool:'search_catalogue', args:{category:'dining', guests:40}}]);
await run('ai stays 0 nights', [{tool:'search_catalogue', args:{category:'stays', city:'Lisbon', nights:0, guests:9}}]);
await run('ai stays past', [{tool:'search_catalogue', args:{category:'stays', city:'Lisbon', date:'2026-01-01'}}]);
await run('ai manage bad', [{tool:'manage_booking', args:{booking_id:'zzz', action:'cancel'}}]);
await run('ai person crisis in reason', [{tool:'talk_to_person', args:{reason:'customer said they want to end it all'}}]);
await run('ai bank pay 999999', [{tool:'card_and_account', args:{topic:'pay 999999'}}]);
await run('ai bank limit', [{tool:'card_and_account', args:{topic:'increase limit to 50000'}}]);
await run('ai alert', [{tool:'set_alert', args:{what:'when prices to Lisbon drop'}}]);
await run('ai multi', [{tool:'search_flights', args:{destination:'Lisbon'}},{tool:'search_catalogue', args:{category:'stays', city:'Lisbon'}}], 'Booked your flight and hotel.');
await b.close() })()
