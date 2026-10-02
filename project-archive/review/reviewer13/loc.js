const fs=require('fs');
(async()=>{
const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: 420, height: 880 } });
const m = process.argv[2]||'UK';
const p = await ctx.newPage(); const url=`file://${__dirname}/build/test.html?m=${m}&tab=chat`;
await p.goto(url); await p.evaluate(()=>localStorage.clear()); await p.goto(url); await p.waitForTimeout(500);
const phrases = fs.readFileSync(process.argv[3],'utf8').split('\n').filter(Boolean);
const W = +(process.argv[4]||200);
for (const ph of phrases) {
  if (ph.startsWith('#RESET')) { await p.evaluate(()=>localStorage.clear()); await p.goto(url); await p.waitForTimeout(400); continue }
  await p.fill('.gr-ask input', ph); await p.press('.gr-ask input','Enter'); await p.waitForTimeout(W);
  const r = await p.evaluate(()=>{ const s=JSON.parse(localStorage.getItem(Object.keys(localStorage).find(k=>k.startsWith('gratifi-state')))); const msg=s.chat[s.chat.length-1]; return { text: (msg.text||''), kinds: (msg.blocks||[]).map(b=>b.kind+(b.cat?':'+b.cat:'')).join(',') } });
  console.log('| ' + ph + ' | ' + r.kinds + ' | ' + r.text.slice(0, +(process.argv[5]||140)));
}
const errs = await p.evaluate(()=>window.__errs||[]); if (errs.length) console.log('ERRS', errs);
await b.close() })()
