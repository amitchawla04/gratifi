// node ai.js <steps.js> [market] [tag]
const { open } = require('./h.js');
(async () => {
  const [file, market = 'UK', tag = 'ai'] = process.argv.slice(2);
  const steps = require('./' + file);
  const h = await open({ market, ai: true, tag });
  const { p, nav, log, errs } = h;
  await nav(3); await p.waitForTimeout(300);
  log('mode', await p.locator('.app-mode').innerText().catch(() => '?'));
  let i = 0;
  for (const s of steps) {
    if (s.reset) { await p.evaluate(() => localStorage.clear()); await p.goto(h.url()); await p.waitForTimeout(700); await nav(3); continue }
    if (s.js) { const r = await p.evaluate(s.js); log('JS', s.js.slice(0, 80), '=>', JSON.stringify(r)); continue }
    if (s.click) { try { await h.click(s.click, { exact: !!s.exact }) } catch (e) { log('CLICK FAIL', String(s.click)) } if (s.shot) await h.full(s.shot); continue }
    if (s.confirm) { const t = await h.confirm(s.code); log('CONFIRMED', t); continue }
    if (s.nav) { await nav(s.nav); if (s.shot) await h.full(s.shot); continue }
    await p.keyboard.press('Escape').catch(() => {});
    await p.evaluate(({ plan, safety, delay }) => { window.__plan = plan ? eval(plan) : undefined; window.__safetyResp = safety || null; window.__safetyDelay = delay || 50; window.__res = [] }, { plan: s.plan || null, safety: s.safety || null, delay: s.delay || 50 });
    const t0 = Date.now();
    await p.fill('.gr-ask input', s.say); await p.press('.gr-ask input', 'Enter');
    if (s.mid) { await p.waitForTimeout(s.mid); const mt = await p.evaluate(() => { const k = Object.keys(localStorage).find(k => k.startsWith('gratifi-state')); const c = JSON.parse(localStorage.getItem(k)).chat; const g = c[c.length - 1]; return { text: g.text, kinds: (g.blocks || []).map(b => b.kind), sheet: !!document.querySelector('.app-sheet') } }); log('  MID@' + s.mid, JSON.stringify(mt)); }
    await p.waitForTimeout(s.wait || 1500);
    const r = await p.evaluate(() => { const k = Object.keys(localStorage).find(k => k.startsWith('gratifi-state')); const st = JSON.parse(localStorage.getItem(k)); const c = st.chat; const g = c[c.length - 1]; return { text: g.text, kinds: (g.blocks || []).map(b => b.kind + (b.cat ? ':' + b.cat : '') + (b.team ? ':' + b.team : '') + (b.urgent ? ':' + b.urgent : '')), steps: g.steps, res: (window.__res || []).map(x => typeof x === 'string' ? x : { n: x.n, r: x.r && { shown: x.r.shown_to_customer, note: x.r.note } }), bal: st.card.balance, pts: st.balance, frozen: st.card.frozen, nb: st.bookings.length } });
    const sheet = await h.sheetText();
    log(`\n> ${s.say}${s.safety ? '  [safety ' + JSON.stringify(s.safety) + ']' : ''}\n  TEXT: ${r.text}\n  KINDS: [${r.kinds.join(', ')}] steps=${JSON.stringify(r.steps || [])}\n  TOOLS: ${JSON.stringify(r.res)}\n  bal=${r.bal} pts=${r.pts} frozen=${r.frozen} bookings=${r.nb}${sheet ? '\n  SHEET: ' + sheet.slice(0, 220) : ''}`);
    if (s.dump) log('  CARD: ' + (await h.lastText()).slice(0, 1500));
    if (s.shot) await h.full(s.shot);
  }
  log('errs', errs); await h.b.close();
})();
