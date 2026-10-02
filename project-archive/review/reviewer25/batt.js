const run = require('./h.js'); const m = process.argv[2] || 'UK'; const file = process.argv[3]; const ai = process.argv[4] === 'ai';
const Q = require('fs').readFileSync(file, 'utf8').split('\n').filter(x => x.trim() && !x.startsWith('#'));
run(`batt-${m}-${require('path').basename(file)}`, m, async h => {
  const { p, ask, last, lastText, log, nav } = h;
  await nav(3);
  if (ai) await p.evaluate(() => { window.__plan = async () => '' });
  for (const q of Q) {
    if (q === '!clear') { await p.getByRole('button', { name: /^Clear|^مسح/ }).click().catch(() => { }); await p.waitForTimeout(300); continue }
    await ask(q, 650);
    if (await p.$('.app-sheet')) { log('   (sheet open) ' + (await h.sheetText()).slice(0, 150)); await p.keyboard.press('Escape'); await p.waitForTimeout(300) }
    const kinds = await last().evaluate(e => [...e.querySelectorAll('[class*="gr-"]')].map(x => [...x.classList].find(c => /^gr-(card|flight|items|grocery|detail|state|handoff|crisis|controls|checkout|pass|places|calendar)/.test(c))).filter(Boolean).slice(0, 3).join(','));
    console.log(`Q: ${q}\n   A: ${(await lastText()).slice(0, 330)}`);
  }
}, { ai });
