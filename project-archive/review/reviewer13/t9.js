const setup=require('./lib.js');
(async()=>{ const h=await setup('UK',{tag:'t9'}); const {p,nav,ask,full,lastText,log,btn,state,confirm,sheetText,shot}=h;
await nav(3);
await ask('hotel in Lisbon for 3 nights from 20 Oct for 3 people');
log('L', (await lastText()).slice(0,700));
await p.locator('.gr-answer').last().locator('.gr-itemrow').nth(1).click(); await p.waitForTimeout(400);
log('D', (await p.locator('.gr-answer').last().innerText()).replace(/\n/g,' / ').slice(-700)); await full('detail');
// switch to Suite
await p.locator('.gr-answer').last().getByRole('button',{name:/Suite/}).click().catch(()=>p.locator('.gr-answer').last().getByText(/Suite/).click()); await p.waitForTimeout(300);
log('D2', (await p.locator('.gr-answer').last().innerText()).replace(/\n/g,' / ').slice(-400));
const c=p.locator('.gr-answer').last().locator('.gr-detail .gr-btn').last(); await c.click(); await p.waitForTimeout(500);
log('C', (await lastText()).replace(/\n/g,' / ').slice(0,700));
await btn(/^Pay /); log('S', (await sheetText()).replace(/\n/g,' / ')); await confirm(); log('R', (await lastText()).replace(/\n/g,' / ').slice(0,600));
await ask('make it 4 nights'); log('M', (await lastText()).replace(/\n/g,' / ').slice(0,400));
await ask('book another hotel in Lisbon on 21 Oct'); log('dup', (await lastText()).replace(/\n/g,' / ').slice(0,300));
await h.done() })()
