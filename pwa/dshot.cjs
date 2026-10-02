const { chromium } = require('playwright');
const URL='http://localhost:4173/barclaycard/';
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
const ctx=await b.newContext({viewport:{width:402,height:874},deviceScaleFactor:2,isMobile:true,hasTouch:true});
const p=await ctx.newPage();
const go=async(c,routes,params)=>{await p.goto(URL);await p.evaluate(c=>{localStorage.setItem('barclaycard-concept-v2',JSON.stringify({v:2,cardId:c,tab:'home',suggest:true,alerts:{due:true,statement:true,limit:true,received:true,gratifi:true},memory:[],readNotifs:{},per:{}}))},c);await p.reload();await p.waitForTimeout(900);
 await p.evaluate(([r,pa])=>{window.__bc({type:'home',tab:'home'});r.forEach((x,i)=>window.__bc({type:'push',name:x,params:pa&&pa[i]}))},[routes,params]);await p.waitForTimeout(700)};
const s=async n=>p.screenshot({path:`dshots/${n}.png`});
await go('rewards',['benefits']);await s('a1');
await p.fill('#bq','abroad');await p.waitForTimeout(300);await s('a2');
await go('rewards',['benefit'],[{id:'s75'}]);await s('a3');
await go('premium-plus',['benefit'],[{id:'travel-insurance'}]);await s('a4');
for (const [c,r,n] of [['rewards','cbr','b1'],['amazon','amazon','b2'],['avios-plus','lounge','b3'],['avios-plus','abroad','b4'],['forward','security','b5'],['rewards','calc','b6'],['platinum','alerts','b7'],['rewards','help','b8'],['premium-plus','insurance','c1'],['premium-plus','controls','c2'],['select-cashback','sccash','c3'],['select-charge','pay','c4']]) { await go(c,[r]); await s(n); }
await go('select-charge',[]);await s('c5');
await b.close();})();
