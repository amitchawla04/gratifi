const setup=require('./lib.js');
(async()=>{ const h=await setup('UK',{tag:'t4',load:'st-family.json'}); const {p,nav,ask,full,lastText,log,btn,state,confirm,sheetText,shot}=h;
await nav(3);
await ask('move my return flight to the 22nd');
await btn(/Change at no cost/); log('S', await sheetText()); const r=await confirm(); log(r); log('A', (await lastText()).slice(0,1500)); await full('chg-done');
let s=await state(); log('bal', s.card.balance, s.balance, JSON.stringify(s.bookings[0].extra.back), s.bookings[0].total, s.bookings[0].card, s.bookings[0].pts);
log('ledger', JSON.stringify(s.ledger.slice(0,4)), JSON.stringify(s.txns.slice(0,4)));
await ask('can I leave later on the way out?');
log('B', (await lastText()).slice(0,1200)); await full('later');
await h.save('st-family2.json');
await h.done() })()
