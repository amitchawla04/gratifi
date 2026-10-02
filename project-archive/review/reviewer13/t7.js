const setup=require('./lib.js');
(async()=>{ const h=await setup('IN',{tag:'t7'}); const {p,nav,ask,full,lastText,log,btn,state,confirm,sheetText,shot}=h;
await nav(3);
await ask('pay ₹3000 off my card');
const tryCode = async (c) => { const ins = await p.$$('.app-sheet input'); for (let i=0;i<6;i++) await ins[i].fill(c[i]); await p.locator('.app-sheet .gr-btn').last().click().catch(()=>{}); await p.waitForTimeout(1500) };
await tryCode('111111'); await tryCode('222222'); await tryCode('333333');
log(await p.evaluate(()=>Object.keys(localStorage).map(k=>k+'='+localStorage.getItem(k).slice(0,120)).filter(x=>!x.startsWith('gratifi-state')).join('\n')));
const s=await state(); log(JSON.stringify(s.sim), JSON.stringify(s.prefs).slice(0,400));
// close sheet and try fraud / freeze while locked
await p.locator('.app-sheet [aria-label=Close], .app-sheet .gr-ibtn').first().click(); await p.waitForTimeout(400);
await ask('freeze my card'); log('F', await lastText(), '|', await sheetText());
await ask('unfreeze my card'); log('U', (await lastText()).slice(0,300), '|', await sheetText());
await p.waitForTimeout(61000); await ask('pay ₹3000 off my card'); log('after 61s', (await sheetText()).replace(/\n/g,' / ').slice(0,400));
await h.done() })()
