const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
const m=process.argv[2]||'UK'; const list=require(process.argv[3]);
(async()=>{ const b=await chromium.launch(); const p=await b.newPage({viewport:{width:420,height:880}}); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
 await p.goto(`file:///tmp/claude-0/-home-claude/d2529b2f-e36e-5c22-8d08-213fa2f214ae/scratchpad/gratifi/review/test.html?m=${m}&tab=chat`); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(400);
 for (const ph of list) { if (ph==='RESET'){ await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(400); continue }
  await p.fill('.gr-ask input', ph); await p.press('.gr-ask input','Enter'); await p.waitForTimeout(250);
  const r=await p.evaluate(()=>{ const s=JSON.parse(localStorage.getItem(Object.keys(localStorage).find(k=>k.startsWith('gratifi-state')))); const msg=s.chat[s.chat.length-1]; const bl=(msg.blocks||[]).map(b=>b.kind+(b.kind==='flights'?`(${b.city},${b.date}->${b.back||'-'},pax${b.pax}${b.tod?','+b.tod:''}${b.direct?',direct':''})`:b.kind==='items'?`(${b.cat}:${(b.ids||[]).slice(0,3).join('/')})`:b.kind==='detail'?`(${b.id||b.item||''}|${JSON.stringify(b).slice(0,160)})`:'')); return (msg.text||'').slice(0,260)+'  ['+bl.join(',')+']' });
  console.log('> '+ph+'\n   '+r) }
 if (errs.length) console.log('ERRS', errs); await b.close() })();
