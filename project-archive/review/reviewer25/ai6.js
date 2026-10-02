const run = require('./h.js'); const m = process.argv[2] || 'UK';
const Q = require('fs').readFileSync(process.argv[3], 'utf8').split('\n').filter(Boolean);
run(`ai6-${m}`, m, async h => {
  const { p, lastText, log, nav } = h;
  await nav(3);
  for (const q of Q) {
    await p.evaluate(() => { window.__res = []; window.__called = 0; window.__plan = async (t, o, run) => { window.__called = 1; return 'MODEL' } });
    await h.ask(q, 900); const called = await p.evaluate(() => window.__called);
    log((called ? 'TO-MODEL ' : 'FIXED    ') + q, '=>', (await lastText()).slice(0, 140));
  }
}, { ai: true });
