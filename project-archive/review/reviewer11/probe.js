// node probe.js <market> <file>  ; file: groups separated by blank lines; each group runs on fresh state, lines sequential
const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
const fs = require('fs');
const m = process.argv[2], file = process.argv[3];
const groups = fs.readFileSync(file, 'utf8').split(/\n\s*\n/).map(g => g.split('\n').map(x => x.trim()).filter(x => x && !x.startsWith('#'))).filter(g => g.length);
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 420, height: 880 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  const url = `file://${__dirname}/build/test.html?m=${m}&tab=chat`;
  await p.goto(url);
  for (const g of groups) {
    await p.evaluate(() => localStorage.clear()); await p.reload(); await p.waitForTimeout(250);
    for (const ph of g) {
      await p.fill('.gr-ask input', ph); await p.press('.gr-ask input', 'Enter'); await p.waitForTimeout(150);
      const r = await p.evaluate(() => { const s = JSON.parse(localStorage.getItem('gratifi-state-v3-' + new URLSearchParams(location.search).get('m'))); const msg = s.chat[s.chat.length - 1]; const bl = (msg.blocks || []); return { text: msg.text || '', kinds: bl.map(b => b.kind + (b.kind==='flights'?`(${b.city},${b.date},${b.back||'-'},pax${b.pax}${b.kids?',k'+b.kids:''}${b.inf?',i'+b.inf:''}${b.tod?','+b.tod:''})`: b.kind==='items'?`(${b.cat}:${(b.ids||[]).length})`: b.kind==='handoff'?`(${b.team||''}:${(b.reason||'').slice(0,30)})`:'' )), frozen: s.card.frozen } });
      const vis = await p.evaluate(() => { const a = [...document.querySelectorAll('.gr-answer')].pop(); return a ? a.innerText.replace(/\s+/g, ' ').slice(0, 260) : '' });
      console.log(`${m} | ${ph} => [${r.kinds.join(',')}]${r.frozen ? ' FROZEN' : ''} ${r.text.slice(0, 220)}${m==='AR'? ' || VIS: '+vis : ''}`);
    }
    console.log('---');
  }
  if (errs.length) console.log('PAGEERRORS', errs.slice(0, 5));
  await b.close();
})();
