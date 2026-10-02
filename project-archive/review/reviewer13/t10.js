const setup=require('./lib.js');
(async()=>{ const h=await setup('UK',{tag:'t10'}); const {p,nav,ask,full,lastText,log,btn,state,confirm,sheetText,shot}=h;
await nav(3);
await ask('Flights to Lisbon on 16 Oct for two'); await p.locator('.gr-flight').first().click(); await p.waitForTimeout(400); await btn(/Continue with/);
await p.locator('.gr-answer').last().locator('input.app-in').nth(1).fill('Sam Taylor'); await btn('Continue',{exact:true});
let s=await state(); const b0=[s.card.balance,s.balance,s.bookings.length,s.ledger.length,s.txns.length];
await nav(5); await p.locator('.app-demo [role=switch]').nth(1).click(); await p.waitForTimeout(300); await nav(3);
await btn(/^Pay /); log('sheet?', (await sheetText()).slice(0,80)); await confirm(); log('F', (await lastText()).replace(/\n/g,' / ').slice(0,400)); await shot('down');
s=await state(); log('before', b0, 'after', [s.card.balance,s.balance,s.bookings.length,s.ledger.length,s.txns.length]);
await nav(5); await p.locator('.app-demo [role=switch]').nth(1).click(); await p.waitForTimeout(300); await nav(3);
await p.getByRole('button',{name:/Try again/}).last().click().catch(e=>log('no try again')); await p.waitForTimeout(500); log('retry', (await lastText()).replace(/\n/g,' / ').slice(0,300));
await h.done() })()
