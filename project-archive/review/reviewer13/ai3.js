const fs=require('fs');
(async()=>{
const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: 420, height: 880 } }); await ctx.addInitScript({ content: fs.readFileSync('fake.js','utf8') });
const m = process.argv[2]||'UK';
const p = await ctx.newPage(); const url=`file://${__dirname}/build/test.html?m=${m}&tab=chat`;
p.on('pageerror', e=>console.log('PAGEERR', e.message));
await p.goto(url); await p.evaluate(()=>localStorage.clear()); await p.goto(url); await p.waitForTimeout(600);
const run = async (label, calls, text='OK.') => {
  await p.evaluate(({calls,text})=>{ window.__plan = () => ({ calls, text }) }, {calls,text});
  await p.fill('.gr-ask input', label); await p.press('.gr-ask input','Enter'); await p.waitForTimeout(700);
  const t = await p.evaluate(()=>{const a=[...document.querySelectorAll('.gr-answer')].pop(); return a.innerText.replace(/\n/g,' / ')});
  const sheet = await p.evaluate(()=>document.querySelector('.app-sheet')?.innerText.replace(/\n/g,' / ').slice(0,300) || '');
  console.log(`== ${label}\n  ${t.slice(0,700)}\n  sheet: ${sheet}\n  res: ${await p.evaluate(()=>JSON.stringify(window.__results).slice(0,300))}`);
};
await run('past stay detail', [{tool:'show_item', args:{id:'ST-Lisbon-0', date:'2026-01-01', nights:2, guests:2}}]);
await run('past stay checkout', [{tool:'prepare_checkout', args:{id:'ST-Lisbon-0', date:'2026-01-01', nights:2, quantity:2}}]);
await run('stay 5 guests 1 room', [{tool:'prepare_checkout', args:{id:'ST-Lisbon-0', date:'2026-10-20', nights:2, quantity:5, rooms:1}}]);
await run('stay 60 nights', [{tool:'prepare_checkout', args:{id:'ST-Lisbon-0', date:'2026-10-20', nights:60, quantity:2}}]);
await run('dining past', [{tool:'prepare_checkout', args:{id:'DN-0', date:'2026-01-01', quantity:2, option:'19:00'}}]);
await p.evaluate(()=>{window.__plan=()=>({calls:[{tool:'search_catalogue',args:{category:'dining'}}],text:''})}); await p.fill('.gr-ask input','dining list'); await p.press('.gr-ask input','Enter'); await p.waitForTimeout(600);
const ids = await p.evaluate(()=>JSON.stringify(window.__results[0].data?.slice?.(0,3)||window.__results)); console.log('dining ids', ids.slice(0,400));
await b.close() })()
