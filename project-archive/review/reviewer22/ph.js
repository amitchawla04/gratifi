// node ph.js MARKET file.txt [ai]  -> each line a phrase; prints reply first 220 chars
const h=require('./h.js');const fs=require('fs');(async()=>{const M=process.argv[2];const L=fs.readFileSync(process.argv[3],'utf8').split('\n').filter(x=>x.trim()&&!x.startsWith('#'));
const H=await h.open(M,{tag:'ph'});const {p}=H;await H.nav(3);
for(const t of L){ if(t==='@clear'){await p.getByRole('button',{name:/^(Clear|مسح)/}).first().click().catch(()=>{});await p.waitForTimeout(200);continue}
 await H.ask(t,500); await p.waitForTimeout(200); const x=(await H.lastText()).replace(/\s+/g,' ').slice(0,260); console.log('>> '+t+'\n   '+x); { const sh=await H.sheetText(); if(sh){ console.log('   SHEET: '+sh.replace(/\s+/g,' ').slice(0,250)); await p.keyboard.press('Escape'); await p.waitForTimeout(300);} }
 await p.getByRole('button',{name:/^(Clear|مسح)$/}).first().click().catch(()=>{}); await p.waitForTimeout(150);}
console.log(H.errs.join('|'));await H.close()})()
