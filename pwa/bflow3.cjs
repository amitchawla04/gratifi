const { chromium } = require('playwright');
const URL='http://localhost:4173/barclaycard/';
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
const ctx=await b.newContext({viewport:{width:402,height:874},deviceScaleFactor:2,isMobile:true,hasTouch:true});
const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push('PAGE '+e.message));p.on('console',m=>{if(m.type()==='error'&&!m.text().includes('404'))errs.push(m.text())});
let n=0;const shot=async name=>{await p.waitForTimeout(700);await p.screenshot({path:`fshots2/${String(++n).padStart(2,'0')}-${name}.png`})};
const setState=async (card)=>{await p.evaluate(c=>{localStorage.setItem('barclaycard-concept-v2',JSON.stringify({v:2,cardId:c,tab:'home',suggest:true,alerts:{due:true,statement:true,limit:true,weekly:false,gratifi:true},memory:[{id:'m1',text:'Window seat',group:'Travel',source:'You told Gratifi'}],readNotifs:{},per:{}}))},card);await p.reload();await p.waitForTimeout(900)};
const top=()=>p.locator('[data-layer]').last();
const click=async (sel)=>{await top().locator(sel).first().click();await p.waitForTimeout(500)};
const back=async()=>{await top().locator('button[aria-label="Back"]').first().click();await p.waitForTimeout(500)};
const tab=async t=>{await p.locator(`nav .tab:has-text("${t}")`).click();await p.waitForTimeout(500)};
try{
await p.goto(URL);await setState('avios-plus');await tab('Card');await click('button.link:has-text("All")');await shot('benefits');await back();
await tab('Rewards');await top().locator('button:has-text("Add")').first().click();await shot('rewards-added');
await click('text=What your Avios could do');await shot('avios');await back();
await click('text=Upgrade voucher:');await shot('voucher');await back();
await top().locator('.stamp:has-text("Hotels")').click();await p.waitForTimeout(500);await shot('browse');await click('text=Casa do Rio');await shot('item');await click('button.btn.big');await shot('checkout');await click('button:has-text("3 months")');await shot('checkout-3');await click('button.btn.big');await p.waitForTimeout(1900);await shot('booked');await click('button:has-text("Done")');
await tab('Rewards');await click('text=Your bookings');await shot('bookings');await top().locator('.row').first().click();await p.waitForTimeout(600);await shot('booking-sheet');await p.locator('.sheet button:has-text("Cancel booking")').click();await p.waitForTimeout(600);await shot('cancelled');await back();
await tab('More');await click('text=What Gratifi remembers');await shot('memory');await back();await click('text=Alerts');await shot('alerts');await back();await click('text=Message us');await shot('help');await back();await click('text=About this concept');await shot('about');await back();
await tab('Home');await shot('home-after');
await p.locator('.askbar .go').click();await p.waitForTimeout(500);
for (const q of ['Freeze my card','When is my payment due?','Spread the cost of my TV','Any offers for me?']) { await top().locator('input[aria-label="Ask Gratifi"]').fill(q);await p.keyboard.press('Enter');await p.waitForTimeout(2600); }
await shot('chat');
await setState('platinum');await click('text=See the maths');await shot('plat-bt');
await setState('forward');await click('text=See my progress');await shot('fwd-promise');await click('text=Your credit score');await shot('fwd-score');
await setState('rewards');await click('text=Take £31.64 cashback');await shot('cashback');await click('button.btn.big');await p.waitForTimeout(700);await shot('cashback-done');
await setState('avios');await click('text=Track it');await shot('welcome');
await setState('premium-plus');await tab('Card');await click('text=Employee cards');await shot('employees');
}catch(e){errs.push('SCRIPT '+e.message.split('\n')[0]);await shot('fail')}
console.log('ERR',JSON.stringify(errs));await b.close();})();
