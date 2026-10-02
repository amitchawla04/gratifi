// node ai.js MARKET cases.js  ; cases.js exports [{q, plan: async (turns,o,run)=>text, pre?:async H=>{}, post?:async H=>{}}]
const h=require('./h.js');(async()=>{const M=process.argv[2];const C=require('./'+process.argv[3]);
const H=await h.open(M,{ai:true,tag:'ai-'+process.argv[3].replace('.js','')});const {p}=H;await p.waitForTimeout(500);
console.log('mode', await p.evaluate(()=>document.querySelector('.app-mode')?.textContent));
await H.nav(3);
for(const c of C){ if(c.pre) await c.pre(H);
 await p.evaluate(src=>{window.__plan=eval(src)}, c.plan.toString());
 const s0=JSON.stringify(await p.evaluate(()=>{const k=Object.keys(localStorage).find(k=>k.startsWith('gratifi-state'));return k?JSON.parse(localStorage.getItem(k)):null}));
 await H.ask(c.q,1200);
 const res=await p.evaluate(()=>JSON.stringify((window.__res||[]).map(r=>typeof r==='string'?r:{n:r.n,a:r.a,r:r.r})).slice(-1200));
 const txt=(await H.lastText()).replace(/\s+/g,' ').slice(-900);
 console.log('\n## '+(c.name||c.q)+'\nRES '+res+'\nUI  '+txt);
 const sh=await H.sheetText(); if(sh){console.log('SHEET '+sh.replace(/\s+/g,' ').slice(0,300)); if(!c.keepSheet){await p.keyboard.press('Escape'); await p.waitForTimeout(400);}}
 if(c.post) await c.post(H);
}
console.log('ERRS',H.errs.join('|'));await H.close()})()
