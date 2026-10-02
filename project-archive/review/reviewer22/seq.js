// node seq.js MARKET file : sequential phrases, no clearing; lines starting with '!' are JS to eval with H in scope
const h=require('./h.js');const fs=require('fs');(async()=>{const M=process.argv[2];const L=fs.readFileSync(process.argv[3],'utf8').split('\n').filter(x=>x.trim()&&!x.startsWith('#'));
const H=await h.open(M,{tag:'seq-'+process.argv[3].replace('.txt','')});const {p}=H;await H.nav(3);
for(const t of L){ try{ if(t.startsWith('!')){ const r=await eval('(async()=>{'+t.slice(1)+'})()'); if(r!==undefined) console.log('!! '+String(r).replace(/\s+/g,' ').slice(0,600)); continue }
 await H.ask(t,600); console.log('>> '+t+'\n   '+(await H.lastText()).replace(/\s+/g,' ').slice(0,420)); { const sh=await H.sheetText(); if(sh){ console.log('   SHEET: '+sh.replace(/\s+/g,' ').slice(0,250)); await p.keyboard.press('Escape'); await p.waitForTimeout(300);} } }catch(e){console.log('ERR '+t+' '+e.message.split('\n')[0])} }
console.log(H.errs.join('|'));await H.close()})()
