const h=require('./h.js');(async()=>{const H=await h.open(process.argv[2]||'UK',{tag:'f1-'+(process.argv[2]||'UK')});const {p}=H;
try{
await H.nav(3); await H.ask('Flights to Lisbon from 9 Oct to 12 Oct for 2 adults and a child aged 7'); await H.full('results'); console.log('R1', await H.lastText());
await p.locator('.gr-flight').first().click(); await p.waitForTimeout(500); await H.full('fares'); console.log('R2', await H.lastText());
await H.btn(/Continue with/); await H.full('seats'); console.log('R3', await H.lastText());
}catch(e){console.log('ERR',e.message.split('\n')[0]); await H.shot('fail')}
console.log(H.errs); await H.close()})()
