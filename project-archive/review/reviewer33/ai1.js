const { open } = require('./h.js');
const SC = require('./' + (process.argv[2] || 'sc1') + '.js');
const only = process.argv[3];
(async () => {
 for (const [name, sc] of Object.entries(SC)) { if (only && !only.split(',').includes(name)) continue;
  const h = await open(sc.m || 'UK', { ai: true, tag: 'ai-' + name });
  try {
   await h.nav(3);
   if (sc.pre) await sc.pre(h);
   await h.p.evaluate(([plan, sr, sd]) => { window.__plan = eval(plan); window.__safetyResp = sr; window.__safetyDelay = sd; }, [sc.plan, sc.safety || null, sc.delay || 50]);
   const s0 = (await h.st()) || { card: {}, bookings: [], balance: '?' };
   await h.ask(sc.q, sc.wait || 3200);
   const s = await h.st(); const msg = s.chat[s.chat.length - 1];
   const res = await h.p.evaluate(() => (window.__res || []).map(r => typeof r === 'string' ? r : { n: r.n, a: r.a, shown: r.r && r.r.shown_to_customer, note: r.r && r.r.note }));
   const sheet = await h.p.$('.app-sheet') ? await h.sheetText() : '';
   console.log('=== ' + name + ' :: ' + sc.q + '\n TEXT: ' + (msg.text || '') + '\n BLOCKS: ' + (msg.blocks || []).map(b => b.kind + (b.team ? ':' + b.team : '')).join(' ') + '\n TOOLS: ' + JSON.stringify(res).slice(0, 900) + (sheet ? '\n SHEET: ' + sheet.slice(0, 400) : '') + '\n STATE: frozen ' + s0.card.frozen + '->' + s.card.frozen + ' bal ' + s0.balance + '->' + s.balance + ' card ' + s0.card.balance + '->' + s.card.balance + ' limit ' + s0.card.limit + '->' + s.card.limit + ' bookings ' + s0.bookings.length + '->' + s.bookings.length + ' alerts ' + JSON.stringify(s.alerts).slice(0, 200));
   if (sc.dom) console.log(' DOM: ' + (await h.lastText()).slice(0, 1500)); if (sc.post) await sc.post(h);
   if (sc.shot) await h.full(name);
  } catch (e) { console.log('=== ' + name + ' FAIL ' + e.message.split('\n')[0]) }
  await h.close();
 }
})();
