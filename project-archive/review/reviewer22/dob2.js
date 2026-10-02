const h=require('./h.js');(async()=>{const H=await h.open('UK',{tag:'dob2'});const {p}=H;
try{await H.nav(3);
await H.ask('Flights to Lisbon from 9 Oct to 12 Oct for 1 adult and a baby'); console.log((await H.lastText()).slice(0,200)); await p.locator('.gr-flight').first().click(); await p.waitForTimeout(400); await H.btn(/Continue with/);
const ins=p.locator('.gr-answer').last().locator('input.app-in:not([type=date])'); console.log('names', await ins.count()); await ins.nth(1).fill('Mira Chawla');
const d=p.locator('.gr-answer').last().locator('input[type=date]'); console.log('dates', await d.count()); await d.first().fill('2025-06-01'); await p.waitForTimeout(300); await H.full('flagged');
const c=p.getByRole('button',{name:'Continue',exact:true}); console.log('continue count', await c.count(), await c.last().isEnabled().catch(()=>'-'), 'last btn', await p.locator('.gr-answer').last().locator('.gr-btn').last().innerText());
await p.locator('.gr-answer').last().locator('.gr-btn').last().click(); await p.waitForTimeout(500); console.log('after', (await H.lastText()).replace(/\s+/g,' ').slice(0,300)); await H.full('after');
}catch(e){console.log('ERR',e.message.split('\n')[0]);await H.shot('fail')}
console.log(H.errs);await H.close()})()
