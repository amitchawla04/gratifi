const {setup}=require('./h.js');
(async()=>{const H=await setup('UK',{len:200,tag:'BIG',tab:'home'});const p=H.p;
await p.addStyleTag({content:'html{font-size:200% !important}'}); await p.waitForTimeout(400);
await H.shot('home',false);
const ov=async(l)=>console.log(l,'overflowX', await p.evaluate(()=>{const w=document.documentElement.clientWidth; return [...document.querySelectorAll('.app *')].filter(e=>{const r=e.getBoundingClientRect(); return r.width>0 && (r.right>w+2) && !e.closest('.app-days,.gr-hscroll,[class*=scroll],.gr-rail,.gr-fares')}).slice(0,6).map(e=>e.className+':'+Math.round(e.getBoundingClientRect().right))}));
await ov('home');
await H.nav(3); await H.say('Flights to Lisbon next weekend for two'); await H.shot('flights'); await ov('flights');
await p.locator('.gr-flight').first().click(); await p.waitForTimeout(500); await H.shot('fares');await ov('fares');
await H.click(/Continue with/); await H.shot('seats'); await ov('seats');
const ins=p.locator('.gr-answer').last().locator('input.app-in'); await ins.nth(1).fill('Sam Taylor'); await H.click('Continue',true); await H.shot('checkout'); await ov('checkout');
await H.click(/^Pay /); await p.waitForTimeout(400); await H.shot('sheet',false);
await p.keyboard.press('Escape'); await H.nav(5); await H.shot('me',false); await ov('me');
await H.nav(4); await H.shot('wallet',false);
await H.done()})()
