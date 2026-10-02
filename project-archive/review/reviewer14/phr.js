const { run } = require('./lib.js');
const m = process.argv[2] || 'UK'; const list = require('./' + (process.argv[3] || 'phr-uk.json'));
run('phr-' + m, m, async (H) => {
  const { p } = H; await H.nav(3);
  for (const ph of list) { await H.ask(ph, 250); const r = await H.last(); console.log(`${ph}  =>  [${r.kinds.join(',')}] ${r.text.replace(/\n/g, ' ').slice(0, 170)}`) }
}, { q: '&tab=chat' });
