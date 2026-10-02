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
};
const pay = async () => { const l=p.getByRole('button',{name:/^Pay /}).last(); await l.scrollIntoViewIfNeeded(); await l.click(); await p.waitForTimeout(400); const s=await p.evaluate(()=>document.querySelector('.app-sheet')?.innerText.replace(/\n/g,' / ')); console.log('SHEET', s); await p.locator('.app-sheet .gr-btn').last().click(); await p.waitForTimeout(2500); console.log('AFTER', await p.evaluate(()=>{const a=[...document.querySelectorAll('.gr-answer')].pop(); return a.innerText.replace(/\n/g,' / ').slice(-500)})) };
await run('past stay checkout', [{tool:'prepare_checkout', args:{id:'ST-Lisbon-0', date:'2026-01-01', nights:2, quantity:2}}]); await pay();
await run('stay 5 guests', [{tool:'prepare_checkout', args:{id:'ST-Lisbon-1', date:'2026-10-20', nights:2, quantity:5}}]); await pay();
const s = await p.evaluate(()=>JSON.parse(localStorage.getItem(Object.keys(localStorage).find(k=>k.startsWith('gratifi-state')))));
console.log(JSON.stringify(s.bookings.map(b=>[b.title,b.when,b.status,b.total,JSON.stringify(b.detail)])));
await p.click('.gr-nav button:nth-child(4)'); await p.waitForTimeout(400); await p.screenshot({path:'shots/ai4-wallet.png'});
await b.close() })()
