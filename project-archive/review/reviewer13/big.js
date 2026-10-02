const setup=require('./lib.js');
(async()=>{ const m=process.argv[2]||'UK'; const h=await setup(m,{tag:'big'+m}); const {p,nav,ask,full,lastText,log,btn,shot}=h;
const zoom = async()=>{ await p.addStyleTag({content:'html{font-size:200% !important}'}); await p.waitForTimeout(300) };
await zoom();
const ov = async (tag)=>{ const r = await p.evaluate(()=>{ const W=document.documentElement.clientWidth; const out=[]; document.querySelectorAll('body *').forEach(e=>{ const b=e.getBoundingClientRect(); if(b.width>0 && (b.right>W+2 || b.left<-2) && getComputedStyle(e).position!=='fixed'){ let p=e.parentElement, clipped=false; while(p){ const s=getComputedStyle(p); if(/(auto|scroll|hidden)/.test(s.overflowX)){ const pb=p.getBoundingClientRect(); if(pb.right<=W+2 && pb.left>=-2){clipped=true;break} } p=p.parentElement } if(!clipped) out.push(e.className+':'+(e.textContent||'').slice(0,30)) } }); return {sw:document.documentElement.scrollWidth, W, out: out.slice(0,8)} }); log(tag, JSON.stringify(r)) };
await shot('home'); await ov('home');
await nav(5); await shot('me'); await ov('me');
await nav(4); await shot('wallet'); await ov('wallet');
await nav(3); await ask('Flights to '+({UK:'Lisbon',AR:'Muscat',IN:'Goa',MY:'Penang'}[m])+' on 16 Oct back 20 Oct for two'); await shot('res'); await ov('res');
await p.locator('.gr-flight').first().click(); await p.waitForTimeout(500); await shot('fares'); await ov('fares');
await btn(/Continue with|تابع بالدرجة/); await p.evaluate(()=>{const e=document.querySelector('.app-main .app-scroll'); e.scrollTop=e.scrollHeight-1500}); await shot('seats'); await ov('seats');
const ins=p.locator('.gr-answer').last().locator('input.app-in'); await ins.nth(1).fill('Sam Taylor');
await btn(m==='AR'?/^متابعة$|^تابع$/:'Continue',{exact:false}).catch(e=>log('nocont')); await p.waitForTimeout(400); await shot('checkout'); await ov('checkout');
await btn(/^Pay |^ادفع /); await shot('sheet'); await ov('sheet');
await h.done() })()
