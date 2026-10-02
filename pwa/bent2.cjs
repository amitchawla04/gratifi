const { chromium } = require('playwright');
const URL='http://localhost:4173/barclaycard/';
const CARDS=['avios-plus','avios','rewards','amazon','platinum','forward','premium-plus','select-cashback','select-charge'];
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
const ctx=await b.newContext({viewport:{width:402,height:874},deviceScaleFactor:2,isMobile:true,hasTouch:true});
const p=await ctx.newPage();p.setDefaultTimeout(2500);const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
const shot=async n=>{await p.waitForTimeout(450);await p.screenshot({path:`eshots2/${n}.png`})};
const scrollTo=async i=>p.evaluate(i=>{const els=[...document.querySelectorAll('.scroll')].filter(e=>e.offsetParent!==null);const e=els[els.length-1];if(e)e.scrollTop=i*700},i);
const bad=[];
for (const c of CARDS){
  await p.goto(URL);await p.evaluate(c=>{localStorage.setItem('barclaycard-concept-v2',JSON.stringify({v:2,cardId:c,tab:'home',suggest:true,alerts:{due:true,statement:true,limit:true,gratifi:true},memory:[],readNotifs:{},per:{}}))},c);await p.reload();await p.waitForTimeout(1000);
  for (const t of ['Home','Rewards','Card','More']) { await p.locator(`nav .tab:has-text("${t}")`).click(); for(let i=0;i<3;i++){await scrollTo(i);await shot(`${c}-tab-${t}-${i}`)} }
  // every benefit detail renders and its action goes somewhere
  await p.evaluate(()=>{window.__bc({type:'home',tab:'home'});window.__bc({type:'push',name:'benefits'})}); await p.waitForTimeout(400);
  const ids = await p.evaluate(()=>[...document.querySelectorAll('[data-layer] .list .row')].length);
  const top=()=>p.locator('[data-layer]').last(); const n = await top().locator('.list button.row').count();
  for (let i=0;i<n;i++){
    await p.evaluate(()=>{window.__bc({type:'home',tab:'home'});window.__bc({type:'push',name:'benefits'})}); await p.waitForTimeout(250);
    await p.waitForTimeout(300); const rows=top().locator('.list button.row'); let txt='?'; try { txt=(await rows.nth(i).innerText()).split('\n')[0]; await rows.nth(i).click(); } catch(e) { bad.push(`${c}: row ${i} not clickable`); continue } await p.waitForTimeout(450);
    const h=await p.locator('h1').last().innerText().catch(()=>'' );
    const cta=top().locator('.cta button'); if(await cta.count()){ try { await cta.first().click() } catch(e) { bad.push(`${c}: ${txt} cta not clickable`); continue } await p.waitForTimeout(350); const hdr=await p.locator('.hdr-title').last().innerText().catch(()=>'' ); const toast=await p.locator('.toast').innerText().catch(()=>''); if(!hdr && !toast) bad.push(`${c}: ${txt} action went nowhere`); }
    if (i<3 && c==='avios-plus') await shot(`${c}-benefit-${i}`);
  }
  console.log(c, 'benefit rows', n);
}
console.log('BAD',JSON.stringify(bad));console.log('ERR',JSON.stringify(errs.slice(0,20)));await b.close();})();
