const h=require('./h.js');(async()=>{const H=await h.open('UK',{tag:'dob'});const {p}=H;
const go=async(q,dob)=>{await H.ask(q); await p.locator('.gr-flight').first().click(); await p.waitForTimeout(400); await H.btn(/Continue with/); const ins=p.locator('.gr-answer').last().locator('input.app-in:not([type=date])'); const n=await ins.count(); for(let i=0;i<n;i++){ if(!(await ins.nth(i).inputValue())) await ins.nth(i).fill(['Priya Chawla','Kabir Chawla','Mira Chawla'][i-1]||'X Y') } const d=p.locator('.gr-answer').last().locator('input[type=date]'); await d.first().fill(dob); await p.waitForTimeout(300); const t=(await H.lastText()).replace(/\s+/g,' '); console.log('>>',q,dob,'\n  ',t.slice(-260)); };
try{await H.nav(3);
await go('Flights to Lisbon from 9 Oct to 12 Oct for 1 adult and a child aged 15','2010-10-11');
await go('Flights to Lisbon from 9 Oct to 12 Oct for 1 adult and a baby','2024-10-10');
await go('Flights to Lisbon from 9 Oct to 12 Oct for 1 adult and a baby','2024-10-20');
// book the last one
await H.btn('Continue',true); await p.waitForTimeout(300); console.log((await H.lastText()).slice(0,200)); await H.btn(/^Pay /); await H.confirm(); console.log('booked', (await H.lastText()).replace(/\s+/g,' ').slice(0,300));
await H.ask('change my return flight to 25 October'); console.log('CH', (await H.lastText()).replace(/\s+/g,' ').slice(0,500)); await H.full('change');
}catch(e){console.log('ERR',e.message.split('\n')[0]);await H.shot('fail')}
console.log(H.errs);await H.close()})()
