const {setup}=require('./h.js');
(async()=>{const H=await setup('UK',{fake:true,len:500,tag:'ai3'});const p=H.p;
await p.waitForTimeout(800);
const plan=async(fn,t,w=900)=>{await p.evaluate(s=>{window.__plan=eval(s); window.__res=[]},fn); const r=await H.say(t,w); return r};
await plan(`async(t,o,run)=>{await run('points_and_giving',{topic:'invest',points:999999,to:'gold'});return 'ok'}`,'invest 999999');
await H.shot('invest-big');
const ack=p.locator('.gr-answer').last().locator('input[type=checkbox]'); if(await ack.count()){await ack.first().check()}
await p.waitForTimeout(300); await H.shot('invest-ticked');
const b=p.locator('.gr-answer').last().locator('.gr-btn').last(); console.log('btn', await b.innerText(), await b.isDisabled());
if(!(await b.isDisabled())){await b.click(); await p.waitForTimeout(400); console.log('sheet', await H.sheetText()); await H.shot('invest-sheet')}
await p.keyboard.press('Escape');
await plan(`async(t,o,run)=>{await run('points_and_giving',{topic:'transfer',points:1234,to:'Northway'});return 'ok'}`,'transfer 1234');
console.log('sheet2', await H.sheetText());
console.log('sheet2', await H.sheetText()); await H.shot('transfer-sheet');
await H.done()})()
