// node probe.js <market> <file with one phrase per line> [tag] ; lines starting with '#' ignored; '!reset' reloads with cleared storage
const { open } = require('./h.js'); const fs = require('fs');
(async () => {
  const [market = 'UK', file, tag = 'probe', shots = ''] = process.argv.slice(2);
  const lines = fs.readFileSync(file, 'utf8').split('\n').filter(x => x.trim() && !x.startsWith('#'));
  const h = await open({ market, tag });
  const { p, nav, ask, log, errs } = h;
  await nav(3);
  let i = 0;
  for (const l of lines) {
    if (l === '!reset') { await p.evaluate(() => localStorage.clear()); await p.goto(h.url()); await p.waitForTimeout(600); await nav(3); continue }
    await p.keyboard.press('Escape').catch(() => {});
    await ask(l, 900);
    const r = await p.evaluate(() => { const k = Object.keys(localStorage).find(k => k.startsWith('gratifi-state')); const c = JSON.parse(localStorage.getItem(k)).chat; const g = c[c.length - 1]; return { say: g.text, kinds: (g.blocks || []).map(b => b.kind + (b.cat ? ':' + b.cat : '') + (b.team ? ':' + b.team : '') + (b.urgent ? ':' + b.urgent : '')), sug: (g.blocks || []).filter(b => b.kind === 'suggest').map(b => b.items).flat() } });
    const sheet = await h.sheetText();
    log(`\n> ${l}\n  ${r.say}\n  [${r.kinds.join(', ')}]${sheet ? '\n  SHEET: ' + sheet.slice(0, 200) : ''}`);
    if (shots) await h.full('p' + (++i));
  }
  log('errs', errs); await h.b.close();
})();
