const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
const m = process.argv[2] || 'UK';
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 420, height: 880 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  const url = `file://${__dirname}/build/test.html?m=${m}&tab=explore`;
  await p.goto(url); await p.evaluate(() => localStorage.clear()); await p.goto(url); await p.waitForTimeout(500);
  const tiles = await p.$$eval('.app-main button', bs => bs.map(b => b.innerText.replace(/\s+/g, ' ').trim()).filter(Boolean));
  console.log('TILES', tiles.length, tiles.slice(0, 30).join(' | '));
  for (let i = 0; i < tiles.length; i++) {
    await p.goto(url); await p.waitForTimeout(300);
    const bs = await p.$$('.app-main button'); if (!bs[i]) continue;
    await bs[i].click(); await p.waitForTimeout(700);
    const r = await p.evaluate(() => { const s = JSON.parse(localStorage.getItem('gratifi-state-v3-' + new URLSearchParams(location.search).get('m'))); const msg = s.chat[s.chat.length - 1]; const u = [...s.chat].reverse().find(x => x.role === 'user'); return { tab: document.querySelector('.app')?.dataset.tab, user: u && u.text, text: msg ? msg.text : '', kinds: msg ? (msg.blocks || []).map(b => b.kind + (b.cat ? ':' + b.cat : '')) : [] } });
    console.log(`[${tiles[i]}] -> tab=${r.tab} user="${r.user}" [${r.kinds}] ${String(r.text).slice(0, 150)}`);
  }
  console.log(errs);
  await b.close();
})();
