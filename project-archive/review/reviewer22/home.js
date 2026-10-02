const h=require('./h.js');(async()=>{const H=await h.open(process.argv[2]||'UK',{tag:'home-'+(process.argv[2]||'UK')});const {p}=H;
try{
await H.btn('See flights'); await H.full('banner'); console.log('B', (await H.lastText()).replace(/\s+/g,' ').slice(0,300));
await H.nav(1); await H.btn('Show ideas'); console.log('I', (await H.lastText()).replace(/\s+/g,' ').slice(0,400)); await H.full('ideas');
await H.nav(1); await p.locator('.app-main .gr-card, .app-main [class*=feat]').filter({hasText:'Food market tour'}).first().click(); await p.waitForTimeout(500); console.log('F', (await H.lastText()).replace(/\s+/g,' ').slice(0,300)); await H.full('featured');
await H.nav(1); await H.btn('Add'); await p.waitForTimeout(300); await H.shot('offer-add'); console.log('O', await p.evaluate(()=>document.querySelector('.app-main').innerText.match(/15% off dining[\s\S]{0,80}/)?.[0]));
await H.nav(1); await p.locator('button[aria-label*="otif"], .app-main button:has(svg)').first().click().catch(()=>{}); await p.waitForTimeout(400); await H.shot('bell');
}catch(e){console.log('ERR',e.message.split('\n')[0]);await H.shot('fail')}
console.log(H.errs);await H.close()})()
