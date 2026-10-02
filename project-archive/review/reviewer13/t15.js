const setup=require('./lib.js');
(async()=>{ const h=await setup('UK',{tag:'t15'}); const {p,nav,ask,full,lastText,log,btn,state,confirm,sheetText,shot}=h;
await nav(3);
await ask('Flights to Lisbon on 16 Oct back 20 Oct for 1 adult and a baby');
await p.locator('.gr-flight').first().click(); await p.waitForTimeout(500); await btn(/Continue with/);
const A=p.locator('.gr-answer').last(); const ins=A.locator('input.app-in');
await ins.nth(1).fill('Mira Chawla'); await ins.nth(2).fill('2024-10-25');
await btn('Continue',{exact:true}); await btn(/^Pay /); await confirm(); log('R', (await lastText()).slice(0,120));
await ask('change my return flight to 28 October'); log('C', (await lastText()).replace(/\n/g,' / ').slice(0,300));
const go = p.getByRole('button',{name:/Change at no cost|Continue, /}).last(); if (await go.count()) { await go.click(); await p.waitForTimeout(400); if (await p.$('.app-sheet')) await confirm(); }
log('C2', (await lastText()).replace(/\n/g,' / ').slice(0,300));
let s=await state(); log(JSON.stringify(s.bookings[0].extra.back), s.bookings[0].extra.dobs);
// disruption on this booking then cancel
await nav(5); await btn('Cancel my next flight'); await nav(3); log('DIS', (await lastText()).replace(/\n/g,' / ').slice(0,700));
await btn('Full refund'); log('FR', (await lastText()).replace(/\n/g,' / ').slice(0,400), '|', (await sheetText()).replace(/\n/g,' / '));
if (await p.$('.app-sheet')) await confirm();
log('FR2', (await lastText()).replace(/\n/g,' / ').slice(0,400));
s=await state(); log('after', s.card.balance, s.balance, s.bookings[0].status, JSON.stringify(s.ledger.slice(0,3)));
await ask('cancel my lisbon flight'); log('again', (await lastText()).replace(/\n/g,' / ').slice(0,200));
await h.done() })()
