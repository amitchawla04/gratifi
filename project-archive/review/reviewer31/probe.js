// node probe.js MARKET file.txt [name]  -- one phrase per line; prints reply text + card kinds. Lines starting with "#" skipped. "!reset" clears.
const H = require('./h.js'); const fs = require('fs');
const m = process.argv[2] || 'UK', f = process.argv[3], nm = process.argv[4] || ('probe-' + m);
const lines = fs.readFileSync(f, 'utf8').split('\n').filter(x => x.trim() && !x.startsWith('#'));
H.run({ market: m, name: nm, ai: !!process.env.AI }, async h => {
  await h.nav(3);
  for (const l of lines) {
    if (l === '!reset') { await h.p.evaluate(() => localStorage.clear()); await h.p.reload(); await h.p.waitForTimeout(500); await h.nav(3); continue }
    if (l.startsWith('!shot')) { await h.full(l.slice(6) || 'shot'); continue }
    if (await h.p.$('.app-sheet')) { await h.p.keyboard.press('Escape'); await h.p.waitForTimeout(200) }
    await h.ask(l, 900);
    const r = await h.p.evaluate(() => { const a = [...document.querySelectorAll('.gr-answer')].pop(); if (!a) return {}; const cards = [...a.querySelectorAll('[class*="gr-"]')].map(e => [...e.classList].filter(c => /^gr-(card|flight|itemrow|detail|checkout|crisis|state|handoff|grocery|seat|slot|fare|pay|cal|chip)/.test(c))).flat(); const btns = [...a.querySelectorAll('button')].map(b => b.innerText.trim()).filter(Boolean).slice(0, 12); return { t: a.innerText.replace(/\s+/g, ' ').slice(0, 600), btns, sheet: !!document.querySelector('.app-sheet') } });
    console.log('\n>> ' + l + '\n   ' + r.t + '\n   [btns] ' + (r.btns || []).join(' | ') + (r.sheet ? ' [SHEET]' : ''));
  }
});
