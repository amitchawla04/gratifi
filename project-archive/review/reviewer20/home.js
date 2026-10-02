const L = require('./lib.js');
const m = process.argv[2] || 'UK';
(async () => {
  const h = await L(m, { tab: 'home' }); const { p, st } = h;
  const labels = await p.$$eval('.app-main button', bs => bs.map(b => (b.getAttribute('aria-label') || b.innerText).replace(/\s+/g, ' ').trim()));
  console.log(labels.length, labels.join(' | '));
  for (let i = 0; i < labels.length; i++) {
    await p.goto(h.url('home')); await p.waitForTimeout(300);
    const bs = await p.$$('.app-main button'); if (!bs[i]) continue;
    await bs[i].scrollIntoViewIfNeeded(); await bs[i].click().catch(() => {}); await p.waitForTimeout(700);
    const r = await p.evaluate((mk) => { const s = JSON.parse(localStorage.getItem('gratifi-state-v3-' + mk) || 'null'); const msg = s && s.chat[s.chat.length - 1]; const u = s && [...s.chat].reverse().find(x => x.role === 'user'); return { tab: document.querySelector('.app')?.getAttribute('data-tab'), head: document.querySelector('.app-main h1, .app-main h2')?.innerText, user: u && u.text, text: msg ? msg.text : '', kinds: msg ? (msg.blocks || []).map(b => b.kind + (b.cat ? ':' + b.cat : '')) : [], sheet: !!document.querySelector('.app-sheet') } }, m);
    console.log(`[${labels[i]}] tab=${r.tab} head=${r.head} user="${r.user}" [${r.kinds}] ${String(r.text).slice(0, 120)} ${r.sheet ? 'SHEET' : ''}`);
    await p.evaluate(mk => { const s = JSON.parse(localStorage.getItem('gratifi-state-v3-' + mk) || 'null'); if (s) { s.chat = []; localStorage.setItem('gratifi-state-v3-' + mk, JSON.stringify(s)) } }, m);
  }
  console.log(h.errs); await h.b.close();
})();
