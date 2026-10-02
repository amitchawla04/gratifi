const H = require('./h.js');
const m = process.argv[2] || 'UK'; const list = require(process.argv[3]);
(async () => {
  const h = await H.open(m, { q: '&tab=chat', tag: m + '-chat' }); const { p } = h;
  for (const ph of list) {
    if (ph === '#reset') { await p.evaluate(() => localStorage.clear()); await p.reload(); await p.waitForTimeout(400); continue }
    await h.ask(ph, 250);
    const r = await h.lastMsg(); let extra = '';
    const s = await h.st(); const x = s.chat[s.chat.length - 1];
    if (x.blocks) for (const b of x.blocks) { if (b.kind === 'flights') extra += ' FL:' + JSON.stringify({ city: b.city, date: b.date, back: b.back, pax: b.pax, n: (b.ids || b.flights || []).length }); if (b.kind === 'detail') extra += ' DT:' + JSON.stringify(b).slice(0, 160); if (b.kind === 'suggest') extra += ' SG:' + JSON.stringify(b.items).slice(0, 120) }
    console.log(`> ${ph}\n  [${r.kinds.join(',')}] ${r.text.replace(/\n/g, ' ').slice(0, 330)}${extra}`);
  }
  console.log('ERR', await h.done());
})();
