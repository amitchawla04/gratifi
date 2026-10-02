const setup=require('./lib.js');
(async()=>{ const h=await setup('UK',{tag:'t16'}); const {p,nav,ask,full,lastText,log,btn,state,confirm,sheetText,shot}=h;
await nav(3);
await ask('Flights to Lisbon on 16 Oct back 20 Oct for two');
await p.locator('.gr-flight').first().click(); await p.waitForTimeout(500); await btn(/Continue with/);
await p.locator('.gr-answer').last().locator('input.app-in').nth(1).fill('Sam Taylor');
await btn('Continue',{exact:true}); await p.locator('.gr-answer').last().getByRole('radio',{name:/^Card/}).click(); await btn(/^Pay /); await confirm();
let s=await state(); log('paid', s.bookings[0].total, s.bookings[0].card, s.bookings[0].pts, 'bal', s.card.balance, s.balance);
await nav(5); await btn('Cancel my next flight'); await nav(4); log('W', (await p.evaluate(()=>document.querySelector('.app-main').innerText)).replace(/\n/g,' / ').slice(0,400)); await shot('wallet-dis');
await nav(3);
await ask('cancel my lisbon flight'); log('C', (await lastText()).replace(/\n/g,' / ').slice(0,500));
await btn('Yes, cancel'); if (await p.$('.app-sheet')) await confirm(); log('C2', (await lastText()).replace(/\n/g,' / ').slice(0,400));
s=await state(); log('after', s.bookings[0].status, 'bal', s.card.balance, s.balance, JSON.stringify(s.txns.slice(0,1)), JSON.stringify(s.ledger.slice(0,2)));
await h.done() })()
