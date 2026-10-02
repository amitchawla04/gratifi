const run = require('./h.js'); const m = process.argv[2] || 'UK';
const plan = async (h, fnSrc, q, w = 1200) => { await h.p.evaluate(src => { window.__plan = eval(src) }, fnSrc); await h.ask(q, w); return await h.p.evaluate(() => JSON.stringify(window.__res || []).slice(0, 1800)) };
run(`ai2-${m}`, m, async h => {
  const { p, lastText, log, nav, shot } = h;
  await nav(3);
  for (const c of ['stays', 'airport', 'rides', 'experiences', 'dining', 'shopping', 'giftcards', 'subs', 'tickets']) {
    const r = await plan(h, `async (t,o,run)=>{ await run('search_catalogue',{category:'${c}'}); return '' }`, 'show ' + c);
    log(c, r.slice(0, 900));
  }
}, { ai: true });
