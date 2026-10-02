const setup=require('./lib.js');
(async()=>{ const h=await setup('UK',{tag:'t19'}); const {p,nav,ask,full,lastText,log,btn,state,confirm,sheetText,shot}=h;
const ctl = async (n)=>{ await nav(5); await btn(n); await p.waitForTimeout(500); const tab = await p.evaluate(()=>document.querySelector('.app')?.getAttribute('data-tab')); const s=await state(); const m=s.chat[s.chat.length-1]; log(n, '| tab', tab, '|', (m?.text||'').slice(0,200), '| bal', s.card.balance, s.balance, '| alerts', (s.alerts||[]).length); };
await ctl(/Points come in/); await ctl('A card payment'); await ctl('Suspicious payment'); await ctl('Return window ends'); await ctl('Delay my order'); await ctl('Deliver my order'); await ctl('Cancel my next flight');
await nav(5); await shot('me-after');
await nav(1); await full('home-after');
await nav(5); await btn('Reset demo'); await p.waitForTimeout(500); log('reset', await sheetText(), (await state())?.card?.balance);
await h.done() })()
