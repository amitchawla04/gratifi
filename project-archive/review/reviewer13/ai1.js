const setup=require('./lib.js'); const fs=require('fs');
(async()=>{
const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: 420, height: 880 } }); await ctx.addInitScript({ content: fs.readFileSync('fake.js','utf8') });
const m = process.argv[2]||'UK';
const p = await ctx.newPage(); const url=`file://${__dirname}/build/test.html?m=${m}&tab=chat`;
await p.goto(url); await p.evaluate(()=>localStorage.clear()); await p.goto(url); await p.waitForTimeout(600);
console.log('mode', await p.evaluate(()=>document.querySelector('.app-mode')?.textContent));
const phrases = fs.readFileSync(process.argv[3]||'sens.txt','utf8').split('\n').filter(Boolean);
for (const ph of phrases) {
  const before = await p.evaluate(()=>window.__calls.length);
  await p.fill('.gr-ask input', ph); await p.press('.gr-ask input','Enter'); await p.waitForTimeout(250);
  const r = await p.evaluate(()=>{ const s=JSON.parse(localStorage.getItem(Object.keys(localStorage).find(k=>k.startsWith('gratifi-state')))); const msg=s.chat[s.chat.length-1]; return { text: (msg.text||'').slice(0,90), kinds: (msg.blocks||[]).map(b=>b.kind).join(',') } });
  const after = await p.evaluate(()=>window.__calls.length);
  console.log((after>before?'MODEL ':'FIXED ') + '| ' + ph + ' | ' + r.kinds + ' | ' + r.text);
}
await b.close() })()
