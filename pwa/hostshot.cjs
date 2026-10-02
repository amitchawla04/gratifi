const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
const c=await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true});const p=await c.newPage(); const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:4173');await p.waitForTimeout(1200);await p.screenshot({path:'shots/h1.png'});
await p.locator('.host-scroll').evaluate(e=>e.scrollTo(0,640));await p.waitForTimeout(600);await p.screenshot({path:'shots/h2.png'});
await p.locator('.host-scroll').evaluate(e=>e.scrollTo(0,5000));await p.waitForTimeout(600);await p.screenshot({path:'shots/h3.png'});
await p.locator('.acc-scroll').evaluate(e=>e.scrollTo(e.clientWidth*0.9,0)); await p.locator('.host-scroll').evaluate(e=>e.scrollTo(0,0));await p.waitForTimeout(700);await p.screenshot({path:'shots/h4.png'});
const d=await b.newContext({viewport:{width:1440,height:960}});const q=await d.newPage();await q.goto('http://localhost:4173');await q.waitForTimeout(1200);await q.screenshot({path:'shots/h5.png'});
console.log('ERR',JSON.stringify(errs));await b.close();})();
