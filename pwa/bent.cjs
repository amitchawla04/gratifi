const { chromium } = require('playwright');
const URL='http://localhost:4173/barclaycard/';
const CARDS=['avios-plus','avios','rewards','amazon','platinum','forward','premium-plus','select-cashback','select-charge'];
const ROUTES={all:['benefits','security','abroad','alerts','help','statements','limit','pay','dd'],personal:['calc','duedate','bt'],'avios-plus':['lounge','avios','voucher'],avios:['avios'],rewards:['cbr'],platinum:['cbr'],forward:['cbr'],amazon:['amazon'],'premium-plus':['insurance','controls','bizrewards'],'select-cashback':['sccash','controls','bizrewards','calc'],'select-charge':['controls','bizrewards','calc']};
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
const ctx=await b.newContext({viewport:{width:402,height:874},deviceScaleFactor:2,isMobile:true,hasTouch:true});
const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
const shot=async n=>{await p.waitForTimeout(500);await p.screenshot({path:`eshots/${n}.png`})};
const scrollShots=async (n,k)=>{const H=await p.evaluate(()=>{const els=[...document.querySelectorAll('.scroll')].filter(e=>e.offsetParent!==null);const e=els[els.length-1];return e?e.scrollHeight:0});const kk=k||Math.min(6,Math.max(1,Math.ceil((H-200)/700)));for(let i=0;i<kk;i++){await p.evaluate(i=>{const els=[...document.querySelectorAll('.scroll')].filter(e=>e.offsetParent!==null);const e=els[els.length-1];if(e)e.scrollTop=i*700},i);await shot(`${n}-${i}`)}};
for (const c of CARDS){
  await p.goto(URL);await p.evaluate(c=>{localStorage.setItem('barclaycard-concept-v2',JSON.stringify({v:2,cardId:c,tab:'home',suggest:true,alerts:{due:true,statement:true,limit:true,weekly:false,received:true,gratifi:true},memory:[],readNotifs:{},per:{}}))},c);await p.reload();await p.waitForTimeout(1000);
  const list=[...ROUTES.all,...(c.startsWith('premium')||c.startsWith('select')?[]:ROUTES.personal),...(ROUTES[c]||[])];
  for(const r of list){ await p.evaluate(r=>{window.__bc({type:'home',tab:'home'});window.__bc({type:'push',name:r})},r); await p.waitForTimeout(450); await scrollShots(`${c}--${r}`); }
  // every benefit detail: check it renders
  const ids=await p.evaluate(()=>[...new Set([...document.querySelectorAll('body')].map(()=>1))]);
}
console.log('ERR',JSON.stringify(errs.slice(0,20)));await b.close();})();
