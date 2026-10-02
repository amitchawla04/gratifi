const setup=require('./lib.js');
(async()=>{ const h=await setup('IN',{tag:'t6'}); const {p,nav,ask,full,lastText,log,btn,state,confirm,sheetText,shot}=h;
await nav(3);
await ask('pay ₹500 off my card'); log('A', await lastText()); log('S', await sheetText()); await shot('sheet');
const s0=await state(); log('bal', s0.card.balance);
const tryCode = async (c) => { const ins = await p.$$('.app-sheet input'); if (ins.length>=6) { for (let i=0;i<6;i++) await ins[i].fill(c[i]) } else await ins[0].fill(c); await p.locator('.app-sheet .gr-btn').last().click().catch(e=>log('btn?',e.message.slice(0,50))); await p.waitForTimeout(1600); log('after '+c+':', (await sheetText()).replace(/\n/g,' / ')) };
await tryCode('111111'); await tryCode('222222'); await shot('warn'); await tryCode('333333'); await shot('locked');
await p.reload(); await p.waitForTimeout(800); await nav(3);
await ask('pay ₹500 off my card'); log('reload', (await sheetText()).replace(/\n/g,' / '), '|', (await lastText()).slice(0,300)); await shot('locked-reload');
const s1=await state(); log('bal', s1.card.balance);
// try another route: a grocery purchase while locked
await ask('milk and bread'); await btn('Checkout'); await btn(/^Pay /).catch(e=>log('nopay')); log('groc', (await sheetText()).replace(/\n/g,' / ').slice(0,300));
await shot('locked-groc');
await h.done() })()
