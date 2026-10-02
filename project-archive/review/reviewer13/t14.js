const setup=require('./lib.js');
(async()=>{ const h=await setup('UK',{tag:'t14'}); const {p,nav,ask,full,lastText,log,btn,state,confirm,sheetText,shot}=h;
const mic = p.locator('.gr-ask button').last(); log('mic label', await mic.getAttribute('aria-label')); await mic.click(); await p.waitForTimeout(800); await shot('mic'); log(await p.evaluate(()=>document.body.innerText.slice(0,300)));
await h.done() })()
