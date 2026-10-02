const setup=require('./lib.js');
(async()=>{ const h=await setup('UK',{tag:'t18'}); const {p,nav,ask,full,lastText,log,btn,state,confirm,sheetText,shot}=h;
await nav(3);
await ask('Flights to Lisbon on 16 Oct back 20 Oct for 1 adult and a baby');
await p.locator('.gr-flight').first().click(); await p.waitForTimeout(500); await btn(/Continue with/);
const A=p.locator('.gr-answer').last(); const ins=A.locator('input.app-in');
await ins.nth(1).fill('Mira Chawla'); await ins.nth(2).fill('2024-10-25');
await btn('Continue',{exact:true}); await btn(/^Pay /); await confirm();
await ask('change my return flight to 28 October');
await p.getByRole('button',{name:/Change at no cost|Continue, /}).last().click(); await p.waitForTimeout(500);
await btn(/^Pay /).catch(()=>log('nopay')); if (await p.$('.app-sheet')) await confirm();
log('C3', (await lastText()).replace(/\n/g,' / ').slice(0,300));
let s=await state(); log(JSON.stringify(s.bookings[0].extra.back), s.bookings[0].extra.dobs, s.bookings[0].extra.inf);
// also change outbound to a date after infant turns 2? Only return matters. Also try change date to make trip with dep after return
await ask('change my flight out to 30 October'); log('O', (await lastText()).replace(/\n/g,' / ').slice(0,300));
await h.done() })()
