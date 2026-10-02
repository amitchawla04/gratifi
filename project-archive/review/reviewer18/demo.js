const {setup}=require('./h.js');
(async()=>{const H=await setup('UK',{len:700,tag:'DEMO',tab:'me'});const p=H.p;
const scr=await H.screen(); console.log(scr.slice(scr.indexOf('Demo')-50));
console.log(JSON.stringify(await p.locator('.app-main button').allInnerTexts()));
await H.fullshot('me');
await H.done()})()
