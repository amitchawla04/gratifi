const setup=require('./lib.js');
(async()=>{ const h=await setup('UK',{tag:'t17'}); const {p,nav,ask,full,lastText,log,btn,state,confirm,sheetText,shot}=h;
await nav(3);
await ask('Flights to Lisbon on 16 Oct back 20 Oct');
await p.locator('.gr-flight').first().click(); await p.waitForTimeout(500); await btn(/Continue with/);
await btn('Continue',{exact:true}); await p.locator('.gr-answer').last().getByRole('radio',{name:/^Card/}).click(); await btn(/^Pay /); await confirm();
await nav(5); await btn('Cancel my next flight'); await nav(4);
await p.locator('.app-main').getByRole('button',{name:'Cancel',exact:true}).first().click(); await p.waitForTimeout(600);
log('WC', (await lastText()).replace(/\n/g,' / ').slice(0,400)); await shot('wc');
await ask('show my boarding pass'); log('BP', (await lastText()).replace(/\n/g,' / ').slice(0,300));
await ask('change my seat'); log('SE', (await lastText()).replace(/\n/g,' / ').slice(0,200));
await ask('move me to the 11:40'); log('MV', (await lastText()).replace(/\n/g,' / ').slice(0,300));
await h.done() })()
