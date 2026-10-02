// node probe.js MARKET file.txt [seq] [ai]  -- one phrase per line; lines starting with '#RESET' reset state; seq keeps state
const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
const fs = require('fs');
const [m, file, mode] = [process.argv[2], process.argv[3], process.argv[4] || 'iso'];
const lines = fs.readFileSync(file, 'utf8').split('\n').filter(x => x.trim());
(async () => {
  const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: 420, height: 880 } });
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
  const url = `file://${__dirname}/build/test.html?m=${m}&tab=chat`;
  const reset = async () => { await p.goto(url); await p.evaluate(() => localStorage.clear()); await p.goto(url); await p.waitForTimeout(400) };
  await reset();
  for (const ph of lines) {
    if (ph.startsWith('#RESET')) { await reset(); continue }
    if (mode === 'iso') await reset();
    if (await p.$('.app-sheet')) { await p.keyboard.press('Escape'); await p.waitForTimeout(300) }
    await p.fill('.gr-ask input', ph); await p.press('.gr-ask input', 'Enter'); await p.waitForTimeout(350);
    const r = await p.evaluate(() => { const s = JSON.parse(localStorage.getItem('gratifi-state-v3-' + new URLSearchParams(location.search).get('m'))); const msg = s.chat[s.chat.length - 1]; const sheet = document.querySelector('.app-sheet'); const last = [...document.querySelectorAll('.gr-answer')].pop(); return { text: msg.text || '', kinds: (msg.blocks || []).map(b => b.kind + (b.cat ? ':' + b.cat : '') + (b.state ? ':' + b.state : '')), sheet: sheet ? sheet.innerText.replace(/\s+/g, ' ').slice(0, 160) : '', shown: last ? last.innerText.replace(/\s+/g, ' ').slice(0, 260) : '' } });
    console.log(`> ${ph}\n  [${r.kinds.join(',')}] ${r.text.slice(0, 400)}${r.sheet ? '\n  SHEET: ' + r.sheet : ''}`);
    if (process.env.SHOWN) console.log('  SHOWN: ' + r.shown);
  }
  if (errs.length) console.log('ERRORS', errs.slice(0, 5));
  await b.close();
})();
