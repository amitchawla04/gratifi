const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
const c=await b.newContext({viewport:{width:402,height:874},deviceScaleFactor:3,isMobile:true,hasTouch:true});const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:4173');await p.waitForTimeout(1200);await p.screenshot({path:'shots/p1.png'});
await p.locator('[aria-label="Open your points assistant"]').click();await p.waitForTimeout(900);await p.screenshot({path:'shots/p2.png'});
await p.locator('text=Get started').click();await p.waitForTimeout(400);await p.locator('text=Allow').click();await p.waitForTimeout(400);await p.locator('text=Not now').first().click();await p.waitForTimeout(400);await p.locator('text=Done').click();await p.waitForTimeout(1200);await p.screenshot({path:'shots/p3.png'});
await p.locator('text=See tickets').click();await p.waitForTimeout(900);await p.screenshot({path:'shots/p4.png'});
const d=await b.newContext({viewport:{width:1440,height:1000}});const q=await d.newPage();await q.goto('http://localhost:4173');await q.waitForTimeout(1000);await q.locator('[aria-label="Open your points assistant"]').click();await q.waitForTimeout(900);await q.screenshot({path:'shots/p5.png'});
console.log('ERR',JSON.stringify(errs));await b.close();})();
