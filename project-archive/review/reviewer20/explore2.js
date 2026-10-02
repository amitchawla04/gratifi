const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
const m = process.argv[2] || 'UK'; const idx = (process.argv[3] || '0,1').split(',').map(Number);
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 420, height: 880 } });
  const url = `file://${__dirname}/build/test.html?m=${m}&tab=explore`;
  await p.goto(url); await p.evaluate(() => localStorage.clear()); await p.goto(url); await p.waitForTimeout(500);
  for (const i of idx) {
    await p.goto(url); await p.waitForTimeout(300);
    const bs = await p.$$('.app-main button'); await bs[i].click(); await p.waitForTimeout(800);
    const h = await p.evaluate(() => document.querySelector('.app-main .app-scroll')?.scrollHeight || 880);
    await p.setViewportSize({ width: 420, height: Math.min(2400, h + 150) }); await p.waitForTimeout(300);
    await p.screenshot({ path: `shots/explore-${m}-${i}.png` }); await p.setViewportSize({ width: 420, height: 880 });
    // click first subcategory
    const sub = await p.$$('.app-main button'); const labels = await Promise.all(sub.map(s => s.innerText())); console.log(i, labels.map(x => x.replace(/\s+/g, ' ')).slice(0, 14).join(' | '));
  }
  await b.close();
})();
