const setup=require('./lib.js');
(async()=>{ const h=await setup('UK',{tag:'t21'}); const {p,nav,ask,full,lastText,log,btn,state,confirm,sheetText,shot}=h;
p.on('popup', async pp=>{ log('POPUP', pp.url()); await pp.close() });
await nav(3); await ask('Earn extra points shopping'); log('L', (await lastText()).replace(/\n/g,' / ').slice(0,400));
await p.locator('.gr-answer').last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(400); log('D', (await lastText()).replace(/\n/g,' / ').slice(0,500));
await p.locator('.gr-answer').last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(600); log('A', (await lastText()).replace(/\n/g,' / ').slice(0,500)); await full('aff');
let s=await state(); log('bal', s.balance, JSON.stringify(s.bookings.map(b=>[b.title,b.status,b.kind,b.extra?.pending])));
await btn(/I bought something/); log('B', (await lastText()).replace(/\n/g,' / ').slice(0,400)); s=await state(); log('pend', JSON.stringify(s.bookings.map(b=>[b.title,b.status,b.kind])), s.balance); await nav(5); log('ME', (await p.evaluate(()=>document.querySelector('.app-main').innerText)).slice(0,600).replace(/\n/g,' / ')); await nav(4); log('W', (await p.evaluate(()=>document.querySelector('.app-main').innerText)).replace(/\n/g,' / ').slice(0,500));
await nav(5); await btn('Return window ends'); await p.waitForTimeout(500); s=await state(); log('after', s.balance, s.chat[s.chat.length-1].text, JSON.stringify(s.ledger.slice(0,2)));
await h.done() })()
