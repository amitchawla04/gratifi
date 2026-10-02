const {setup}=require('./h.js');
(async()=>{const H=await setup('UK',{len:300,tag:'A11Y',tab:'home'});const p=H.p;
const audit=async(l)=>console.log(l, JSON.stringify(await p.evaluate(()=>{
 const unl=[...document.querySelectorAll('button,[role=button],a,input,[role=switch],[role=radio]')].filter(e=>{const n=(e.getAttribute('aria-label')||e.innerText||e.getAttribute('title')||e.getAttribute('placeholder')||'').trim(); const lab=e.id&&document.querySelector(`label[for="${e.id}"]`); return !n && !lab && !e.closest('label') && e.offsetParent}).map(e=>e.tagName+'.'+e.className.toString().slice(0,30)+(e.getAttribute('aria-label')===null?'':''));
 const imgs=[...document.querySelectorAll('img')].filter(i=>!i.hasAttribute('alt')).length;
 const small=[...document.querySelectorAll('button,[role=button]')].filter(e=>{const r=e.getBoundingClientRect(); return e.offsetParent && r.width>0 && (r.height<24||r.width<24)}).map(e=>(e.innerText||e.getAttribute('aria-label')||'').slice(0,20)+':'+Math.round(e.getBoundingClientRect().width)+'x'+Math.round(e.getBoundingClientRect().height));
 const live=[...document.querySelectorAll('[aria-live],[role=log],[role=status]')].map(e=>e.className.toString().slice(0,30)+':'+(e.getAttribute('aria-live')||e.getAttribute('role')));
 return {lang:document.documentElement.lang, h1:document.querySelectorAll('h1').length, unl:unl.slice(0,15), unlN:unl.length, imgsNoAlt:imgs, small:small.slice(0,12), live}
})));
await audit('HOME'); await H.nav(2); await audit('EXPLORE'); await H.nav(3);
await H.say('Flights to Lisbon next weekend for two'); await p.locator('.gr-flight').first().click(); await p.waitForTimeout(400); await H.click(/Continue with/); await audit('SEATS');
await p.locator('.gr-answer').last().locator('input.app-in').nth(1).fill('Sam Taylor'); await H.click('Continue',true); await H.click(/^Pay /);
console.log('SHEET', JSON.stringify(await p.evaluate(()=>{const s=document.querySelector('.app-sheet'); const d=s.closest('[role=dialog]')||s.querySelector('[role=dialog]')||(s.getAttribute('role')==='dialog'?s:null); return {role:d&&d.getAttribute('role'), modal:d&&d.getAttribute('aria-modal'), label:d&&(d.getAttribute('aria-label')||d.getAttribute('aria-labelledby')), active:document.activeElement.className+'|'+document.activeElement.innerText?.slice(0,30), inert:[...document.querySelectorAll('[inert]')].map(e=>e.className.toString().slice(0,25))}})));
for(let i=0;i<8;i++){await p.keyboard.press('Tab')} console.log('focus after 8 tabs', await p.evaluate(()=>document.activeElement.closest('.app-sheet')?'inside sheet':'OUTSIDE '+document.activeElement.className));
await p.keyboard.press('Escape'); await p.waitForTimeout(300); console.log('focus after esc', await p.evaluate(()=>document.activeElement.className+'|'+document.activeElement.innerText?.slice(0,30)));
await H.nav(5); await audit('ME');
// contrast sample of meta text
console.log('contrast', await p.evaluate(()=>{const el=document.querySelector('.gr-meta'); if(!el) return 'none'; const cs=getComputedStyle(el); return cs.color+' on '+getComputedStyle(document.body).backgroundColor+' size '+cs.fontSize}));
await H.done()})()
