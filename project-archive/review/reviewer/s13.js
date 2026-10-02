const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
const APP='/tmp/claude-0/-home-claude/d2529b2f-e36e-5c22-8d08-213fa2f214ae/scratchpad/gratifi/review/test.html';
(async()=>{ const b=await chromium.launch();
 for (const m of ['UK','AR']) {
  const p=await (await b.newContext({viewport:{width:420,height:880}})).newPage();
  const t0=Date.now(); await p.goto(`file://${APP}?m=${m}`); await p.waitForSelector('.gr-nav'); const t1=Date.now();
  await p.evaluate(()=>{window.__lt=[]; new PerformanceObserver(l=>l.getEntries().forEach(e=>window.__lt.push(Math.round(e.duration)))).observe({type:'longtask',buffered:true})});
  await p.click('.gr-nav button:nth-child(3)');
  const qs=['Flights to Lisbon','Milk, eggs and bread','A table tonight','Concerts this month','Where did my money go?','Transfer points to miles','Travel insurance','Things to do in Lisbon','A hotel in Lisbon','Book a lounge'];
  const times=[];
  for(let r=0;r<3;r++) for(const q of qs){ await p.fill('.gr-ask input',q); const s=Date.now(); await p.press('.gr-ask input','Enter'); await p.waitForFunction(()=>!document.querySelector('.gr-typing'),null,{timeout:5000}).catch(()=>{}); await p.waitForTimeout(50); times.push(Date.now()-s) }
  const lt=await p.evaluate(()=>window.__lt); const nodes=await p.evaluate(()=>document.querySelectorAll('*').length);
  console.log(m,'load ms',t1-t0,'ask ms first/last',times.slice(0,3),times.slice(-3),'longtasks>50ms',lt.length,'max',Math.max(0,...lt),'DOM nodes',nodes);
 }
 await b.close() })();
