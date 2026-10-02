const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});const p=await (await b.newContext({viewport:{width:402,height:874}})).newPage();
await p.goto('http://localhost:4173/barclaycard/');await p.evaluate(()=>localStorage.setItem('barclaycard-concept-v2',JSON.stringify({v:2,cardId:'avios-plus',tab:'card',suggest:true,alerts:{},memory:[],readNotifs:{},per:{}})));await p.reload();await p.waitForTimeout(800);
await p.locator('nav .tab:has-text("Card")').click();await p.waitForTimeout(500);
const r=await p.evaluate(()=>{const t=document.querySelector('.toggle');const b=t.getBoundingClientRect();const x=b.left+b.width/2;const hits=[-7,7].map(dy=>{const y=dy<0?b.top+dy:b.bottom+dy-1;const e=document.elementFromPoint(x,y);return e===t||t.contains(e)});return {h:b.height,hits}});console.log(JSON.stringify(r));await b.close()})();
