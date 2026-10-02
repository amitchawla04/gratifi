const h=require('./h.js');(async()=>{const H=await h.open('IN',{tag:'otp'});const {p}=H;
try{await H.nav(3); await H.ask('What do I owe?'); await H.btn(/^Pay /);
for(let k=0;k<3;k++){ const ins=await p.$$('.app-sheet input'); for(let i=0;i<6;i++) await ins[i].fill('111111'[i]); await p.waitForTimeout(200); const b=p.locator('.app-sheet .gr-btn').last(); if(await b.isEnabled()) await b.click(); await p.waitForTimeout(700); console.log('try',k+1, (await H.sheetText()).replace(/\s+/g,' ').slice(0,400)); }
await H.shot('locked');
await p.keyboard.press('Escape'); await p.waitForTimeout(300);
const s=await H.state(); console.log('card',JSON.stringify(s.card),'lock', JSON.stringify(Object.keys(s).filter(k=>/otp|lock|pause/i.test(k)).map(k=>[k,s[k]])));
await p.reload(); await p.waitForTimeout(800); await H.nav(3); await H.ask('What do I owe?'); await H.btn(/^Pay /); console.log('after reload', (await H.sheetText()).replace(/\s+/g,' ').slice(0,400)); await H.shot('reload');
await p.keyboard.press('Escape');
// another payment type while paused: gift card
await H.ask('Transfer points to miles'); console.log((await H.lastText()).slice(0,200));
}catch(e){console.log('ERR',e.message.split('\n')[0]);await H.shot('fail')}
console.log(H.errs);await H.close()})()
