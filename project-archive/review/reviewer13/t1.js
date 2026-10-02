const setup=require('./lib.js');
(async()=>{ const h=await setup('UK',{tag:'t1'}); const {p,nav,ask,full,lastText,log,btn,state,confirm,sheetText}=h;
await nav(3);
await ask('Flights to Lisbon on 16 Oct back 20 Oct for 2 adults, a 6 year old and a baby');
log('A', (await lastText()).slice(0,900)); await full('res');
await p.locator('.gr-flight').first().click(); await p.waitForTimeout(500); log('B', (await lastText()).slice(0,1500)); await full('fares');
await h.done() })()
