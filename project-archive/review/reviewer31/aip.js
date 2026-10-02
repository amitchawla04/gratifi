// AI probe: node aip.js MARKET steps.js name ; steps.js exports array of {say, plan (string of async fn body using run, turns, o), safety, delay, shot, pre(h)}
const H = require('./h.js');
const m = process.argv[2] || 'UK', steps = require('./' + process.argv[3]), nm = process.argv[4] || 'aip';
H.run({ market: m, name: nm, ai: true }, async h => {
  await h.nav(3);
  for (const s of steps) {
    if (s.pre) { await s.pre(h); }
    if (!s.say) continue;
    if (await h.p.$('.app-sheet') && !s.keepSheet) { await h.p.keyboard.press('Escape'); await h.p.waitForTimeout(200) }
    const st0 = await h.state();
    await h.p.evaluate(([plan, sr, sd]) => { window.__safetyResp = sr || null; window.__safetyDelay = sd || 50; window.__plan = new Function('turns', 'o', 'run', 'return (async()=>{' + plan + '})()') }, [s.plan || "return ''", s.safety, s.delay]);
    await h.ask(s.say, s.wait || 1500);
    const r = await h.p.evaluate(() => { const a = [...document.querySelectorAll('.gr-answer')].pop(); return { t: a ? a.innerText.replace(/\s+/g, ' ').slice(0, 700) : '', res: JSON.stringify((window.__res || []).map(x => typeof x === 'string' ? x : { n: x.n, a: x.a, r: typeof x.r === 'string' ? x.r.slice(0, 300) : JSON.stringify(x.r || '').slice(0, 300) })), sheet: document.querySelector('.app-sheet') ? document.querySelector('.app-sheet').innerText.replace(/\s+/g, ' ').slice(0, 300) : null } });
    const st1 = await h.state();
    const diff = []; if (st0 && st1) { if (st0.balance !== st1.balance) diff.push('pts ' + st0.balance + '->' + st1.balance); if (JSON.stringify(st0.card) !== JSON.stringify(st1.card)) diff.push('card ' + JSON.stringify(Object.fromEntries(Object.entries(st1.card).filter(([k, v]) => JSON.stringify(st0.card[k]) !== JSON.stringify(v))))); if (JSON.stringify(st0.bookings) !== JSON.stringify(st1.bookings)) diff.push('bookings ' + st1.bookings.map(b => b.id + ':' + b.status + ':' + b.total).join(',')) }
    console.log('\n>> ' + s.say + '\n   TEXT: ' + r.t + '\n   TOOLS: ' + r.res.slice(0, 1200) + (r.sheet ? '\n   SHEET: ' + r.sheet : '') + (diff.length ? '\n   STATE: ' + diff.join(' ; ').slice(0, 600) : ''));
    if (s.shot) await h.full(s.shot);
    if (s.post) await s.post(h);
  }
});
