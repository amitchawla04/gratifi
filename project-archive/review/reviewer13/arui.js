const fs=require('fs');
(async()=>{
const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: 420, height: 880 } });
const p = await ctx.newPage(); const url=`file://${__dirname}/build/test.html?m=AR&tab=chat`;
await p.goto(url); await p.evaluate(()=>localStorage.clear()); await p.goto(url); await p.waitForTimeout(500);
const phrases = fs.readFileSync(process.argv[2],'utf8').split('\n').filter(Boolean);
for (const ph of phrases) {
  await p.fill('.gr-ask input', ph); await p.press('.gr-ask input','Enter'); await p.waitForTimeout(350);
  const t = await p.evaluate(()=>{const a=[...document.querySelectorAll('.gr-answer')].pop(); return a.innerText.replace(/\n/g,' / ')});
  const lat = (t.match(/[A-Za-z][A-Za-z' ]{3,}/g)||[]).filter(w=>!/Gratifi|Coastline|Northway|Aurora|Air|Cedar|Hotel|Garden|Suites|Courtyard|Residence|Face ID|GR|DXB|MCT|IST|LHR|eSIM|Tunewave|Screenly/.test(w));
  console.log('| '+ph+' | '+t.slice(0,220)+(lat.length?'  <<LATIN: '+lat.slice(0,6).join(', '):''));
}
console.log('MISSING:', JSON.stringify([...(await p.evaluate(()=>[...(window.__missing||[])]))]).slice(0,3000));
await b.close() })()
