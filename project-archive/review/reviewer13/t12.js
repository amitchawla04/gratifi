const setup=require('./lib.js');
(async()=>{ const h=await setup('UK',{tag:'t12'}); const {p,nav,ask,full,lastText,log,btn,state,confirm,sheetText,shot}=h;
await nav(3);
await ask('Start a streaming subscription'); await p.locator('.gr-answer').last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(400);
log('D', (await lastText()).replace(/\n/g,' / ').slice(0,400));
const c=p.locator('.gr-answer').last().locator('.gr-detail .gr-btn').last(); await c.click(); await p.waitForTimeout(400); log('C', (await lastText()).replace(/\n/g,' / ').slice(0,500));
await btn(/^Pay /); log('S',(await sheetText()).replace(/\n/g,' / ')); await confirm(); log('R', (await lastText()).replace(/\n/g,' / ').slice(0,400));
await ask('pause screenly'); log('P', (await lastText()).replace(/\n/g,' / ').slice(0,300));
await ask('resume screenly'); log('Re', (await lastText()).replace(/\n/g,' / ').slice(0,300), '|', (await sheetText()).replace(/\n/g,' / ')); if (await p.$('.app-sheet')) await confirm();
await ask('cancel screenly'); log('Ca', (await lastText()).replace(/\n/g,' / ').slice(0,400));
await p.locator('.gr-answer').last().getByRole('button',{name:/Yes|cancel/i}).first().click().catch(()=>{}); await p.waitForTimeout(500); log('Ca2', (await lastText()).replace(/\n/g,' / ').slice(0,400), '|', await sheetText());
let s=await state(); log(s.card.balance, s.balance, JSON.stringify(s.bookings.map(b=>[b.title,b.status,b.total,b.pts,b.card])));
await ask('turn on tunewave'); log('T', (await lastText()).replace(/\n/g,' / ').slice(0,300));
await ask('cancel my disney plus'); log('DP', (await lastText()).replace(/\n/g,' / ').slice(0,300));
await h.done() })()
