const run = require('./h.js'); const m = process.argv[2] || 'UK';
run(`ai5-${m}`, m, async h => {
  const { p, lastText, log, nav } = h;
  await nav(3);
  for (const r of ['bereavement', 'husband died last month', 'serious illness, cannot work', 'financial difficulty', 'cannot pay the bill', 'dementia, power of attorney', 'complaint about a hotel']) {
    await p.evaluate(r => { window.__plan = async (t, o, run) => { await run('talk_to_person', { reason: r }); return '' } }, r);
    await h.ask('help', 1000);
    log(r, '=>', (await lastText()).slice(0, 200));
  }
}, { ai: true });
