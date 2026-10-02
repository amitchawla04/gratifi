const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
const st=c=>JSON.stringify({v:2,cardId:c,tab:'home',suggest:true,alerts:{due:true},memory:[],readNotifs:{},per:{}});
let p=await (await b.newContext({viewport:{width:1440,height:1000}})).newPage();await p.goto('http://localhost:4173/barclaycard/');await p.evaluate(s=>localStorage.setItem('barclaycard-concept-v2',s),st('avios-plus'));await p.reload();await p.waitForTimeout(1200);await p.screenshot({path:'fshots/desk.png'});
p=await (await b.newContext({viewport:{width:375,height:667},deviceScaleFactor:2,isMobile:true})).newPage();await p.goto('http://localhost:4173/barclaycard/');await p.evaluate(s=>localStorage.setItem('barclaycard-concept-v2',s),st('premium-plus'));await p.reload();await p.waitForTimeout(1200);await p.screenshot({path:'fshots/se1.png'});
await p.evaluate(()=>{document.querySelector('.scroll').scrollTop=520});await p.waitForTimeout(300);await p.screenshot({path:'fshots/se2.png'});
const ov=await p.evaluate(()=>[...document.querySelectorAll('*')].filter(e=>e.scrollWidth>e.clientWidth+1&&getComputedStyle(e).overflowX==='visible'&&e.clientWidth>0).slice(0,5).map(e=>e.className));console.log('overflow',ov, await p.evaluate(()=>document.documentElement.scrollWidth));
await b.close();})();
