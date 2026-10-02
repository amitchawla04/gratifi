// env PLANS: file with array of {q, plan (string of async fn body using run), escape}
module.exports = async (h) => { await h.nav(3); await h.p.waitForTimeout(500);
  console.log('MODE', await h.p.evaluate(() => document.querySelector('.app-mode')?.textContent));
  const P = require(require('path').resolve(process.env.PLANS));
  for (const x of P) {
    await h.plan(`(async (turns, o, run) => { ${x.plan} })`);
    await h.ask(x.q, x.w || 900);
    const r = await h.res(); const t = await h.last();
    console.log(`\n[${x.q}]\n  TOOLS: ${JSON.stringify(r.map(e => typeof e === 'string' ? e : { n: e.n, a: e.a, r: e.r && { s: e.r.shown_to_customer, note: e.r.note } })).slice(0, 900)}\n  ANSWER: ${t.slice(0, 700)}`);
    const s = await h.sheet(); if (s) { console.log('  SHEET: ' + s.slice(0, 500)); if (x.pay) { await h.confirm(); console.log('  PAID ->', (await h.last()).slice(0, 300)) } else { await h.p.keyboard.press('Escape'); await h.p.waitForTimeout(300) } }
    if (x.shot) await h.full(x.shot);
    if (x.after) await eval(`(async (h) => { ${x.after} })`)(h);
  }
  const s = await h.state(); console.log('\nEND card', JSON.stringify(s.card).slice(0, 260), 'pts', s.balance, 'bookings', (s.bookings || []).map(b => b.title + ':' + b.status + ':' + b.total).join('; '));
}
