const setup=require('./lib.js');
(async()=>{ const h=await setup('UK',{tag:'t20'}); const {p,nav,ask,full,lastText,log,btn,state,confirm,sheetText,shot}=h;
p.on('dialog', async d=>{ log('DIALOG', d.type(), d.message()); await d.accept() });
await nav(5); await btn(/Points come in/); await p.waitForTimeout(300); log((await state()).balance);
await btn('Reset demo'); await p.waitForTimeout(800); await shot('reset'); const s=await state(); log('after reset', s?.balance, s?.card?.balance, await p.evaluate(()=>document.querySelector('.app')?.getAttribute('data-tab')));
await h.done() })()
