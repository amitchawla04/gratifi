const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
async function run(label, vh, sat){
 const c=await b.newContext({viewport:{width:402,height:vh},deviceScaleFactor:2,isMobile:true,hasTouch:true});
 await c.addInitScript((sat)=>{Object.defineProperty(navigator,'standalone',{get:()=>true});Object.defineProperty(screen,'height',{get:()=>874});Object.defineProperty(screen,'width',{get:()=>402});
  document.addEventListener('DOMContentLoaded',()=>{const s=document.createElement('style');s.textContent='[data-sa-probe]{padding-top:'+sat+'px!important}';document.head.appendChild(s)})},sat);
 const p=await c.newPage();await p.goto('http://localhost:4173');await p.waitForTimeout(1500);
 const r=await p.evaluate(()=>({appH:getComputedStyle(document.documentElement).getPropertyValue('--app-h'),sab:getComputedStyle(document.documentElement).getPropertyValue('--sabx'),stage:document.querySelector('.stage').getBoundingClientRect().bottom,tabs:document.querySelector('.host-tabs').getBoundingClientRect().bottom,scrollY:document.scrollingElement.scrollHeight}));
 console.log(label,JSON.stringify(r)); await c.close();}
await run('translucent-bug(812,sat62)',812,62);
await run('opaque-bug(750,sat0)',750,0);
await run('opaque-ok(812,sat0)',812,0);
await run('translucent-ok(874,sat62)',874,62);
await b.close();})();
