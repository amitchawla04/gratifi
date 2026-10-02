const setup=require('./lib.js');
(async()=>{ const h=await setup('UK',{tag:'t5',load:'st-family2.json'}); const {p,nav,ask,full,lastText,log,btn,state,confirm,sheetText,shot}=h;
await nav(3);
let s=await state(); log('before', s.card.balance, s.balance);
await ask('change my seats');
log('SC', (await lastText()).slice(0,600)); await full('seatchg');
await ask('cancel my lisbon flight');
log('C', (await lastText()).slice(0,1500)); await full('cancel');
await btn(/Yes, cancel/); log('S', await sheetText()); log(await confirm()); log('D', (await lastText()).slice(0,1500)); await full('cancelled');
s=await state(); log('after', s.card.balance, s.balance, JSON.stringify(s.ledger.slice(0,4)), JSON.stringify(s.txns.slice(0,2)));
await ask('cancel my lisbon flight'); log('E', (await lastText()).slice(0,500));
await nav(4); log('W', (await p.evaluate(()=>document.querySelector('.app-main').innerText)).slice(0,800));
await h.done() })()
