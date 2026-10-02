const setup=require('./lib.js');
(async()=>{ const h=await setup('UK',{tag:'t3'}); const {p,nav,ask,full,lastText,log,btn,state,confirm,sheetText,shot}=h;
await nav(3);
await ask('hello'); const s0=await state(); log('bal0', s0.card.balance, s0.points, Object.keys(s0));
await ask('Flights to Lisbon on 16 Oct back 20 Oct for 2 adults, a 6 year old and a baby');
await p.locator('.gr-flight').first().click(); await p.waitForTimeout(500);
await btn(/Continue with/);
const A=p.locator('.gr-answer').last(); const ins=A.locator('input.app-in');
await ins.nth(1).fill('Priya Chawla'); await ins.nth(2).fill('Kabir Chawla'); await ins.nth(3).fill('2020-05-03'); await ins.nth(4).fill('Mira Chawla'); await ins.nth(5).fill('2025-06-10');
await A.getByRole('radio',{name:/Priya/}).click(); await A.locator('button[aria-label^="Seat 14A"]').click();
await A.locator('button[aria-label="More Checked bag"]').click(); await A.locator('button[aria-label="More Checked bag"]').click();
await p.waitForTimeout(200);
await btn('Continue',{exact:true}); log('CHK', (await lastText()).slice(-900));
await btn(/^Pay /); log('SHEET', await sheetText()); await shot('sheet');
await confirm(); log('RCPT', (await lastText()).slice(-1500)); await full('receipt');
const s1=await state(); log('bal1', s1.card.balance, s1.points, JSON.stringify(s1.bookings[0]).slice(0,1500));
await h.save('st-family.json');
await h.done() })()
