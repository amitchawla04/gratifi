const { open } = require('./h.js');
(async () => {
  const h = await open({ market: process.argv[2] || 'UK', ai: true, tag: 'guard' });
  const { p, log } = h;
  const L = require('fs').readFileSync(process.argv[3], 'utf8').split('\n').filter(Boolean);
  for (const t of L) { const r = await p.evaluate(t => window.__clean ? window.__guard(window.__clean(t), { money: false, frozen: false, listing: false, card: true }) : 'n/a', t); log((r.includes('Nothing') ? 'CAUGHT ' : 'PASSED ') + t + '\n     => ' + r) }
  await h.b.close();
})();
