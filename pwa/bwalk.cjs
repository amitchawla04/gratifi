const { chromium } = require('playwright');
const URL='http://localhost:4173/barclaycard/';
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
const ctx=await b.newContext({viewport:{width:402,height:874},deviceScaleFactor:2,isMobile:true,hasTouch:true});
const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
const shot=async n=>{await p.waitForTimeout(650);await p.screenshot({path:`bshots/${n}.png`})};
const scrollShots=async (n,k=3)=>{for(let i=0;i<k;i++){await p.evaluate(i=>{const els=[...document.querySelectorAll('.scroll')].filter(e=>e.offsetParent!==null);const e=els[els.length-1];if(e)e.scrollTop=i*700},i);await shot(`${n}-${i}`)}};
const setState=async (card)=>{await p.evaluate(c=>{localStorage.setItem('barclaycard-concept-v2',JSON.stringify({v:2,cardId:c,tab:'home',suggest:true,alerts:{due:true,statement:true,limit:true,weekly:false,gratifi:true},memory:[],readNotifs:{},per:{}}))},card);await p.reload();await p.waitForTimeout(900)};
await p.goto(URL);await p.waitForTimeout(900);await scrollShots('00-picker',3);
await p.locator('text=Barclaycard Avios Plus').click();await p.waitForTimeout(1900);await scrollShots('01-home-new',2);
await p.locator('button:has-text("Turn on")').click();await scrollShots('02-home-on',5);
for (const t of ['Spending','Rewards','Card','More']) { await p.locator(`nav .tab:has-text("${t}")`).click(); await scrollShots('03-'+t,3); }
await p.locator('nav .tab:has-text("Home")').click();
await p.locator('.askbar .go').click();await shot('04-ask-empty');
await p.locator('input[aria-label="Ask Gratifi"]').fill('How close am I to my upgrade voucher?');await p.keyboard.press('Enter');await p.waitForTimeout(2600);await shot('04-ask-voucher');
await p.locator('input[aria-label="Ask Gratifi"]').fill('Find a hotel in Lisbon');await p.keyboard.press('Enter');await p.waitForTimeout(2600);await shot('04-ask-hotel');
for (const c of ['avios','rewards','amazon','platinum','forward','premium-plus','select','flex']) { await setState(c); await scrollShots('10-'+c,2); await p.locator('nav .tab:has-text("Rewards")').click(); await shot('11-'+c+'-rewards'); }
console.log('ERR',JSON.stringify(errs.slice(0,10)));await b.close();})();
