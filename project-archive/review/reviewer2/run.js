// node run.js <market> <steps.js> [theme] [page=test] [prefix]
const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
const R = '/tmp/claude-0/-home-claude/d2529b2f-e36e-5c22-8d08-213fa2f214ae/scratchpad/gratifi/review/';
const market = process.argv[2] || 'UK', steps = process.argv[3], theme = process.argv[4] || 'light', page = process.argv[5] || 'test', prefix = process.argv[6] || require('path').basename(steps, '.js');
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 420, height: 880 }, deviceScaleFactor: 1 });
  const p = await ctx.newPage();
  const errs = []; p.on('pageerror', e => errs.push('PAGE ' + e.message)); p.on('console', m => { if (m.type() === 'error') errs.push('CON ' + m.text()) });
  const url = (x = '') => `file://${R}${page}.html?m=${market}&theme=${theme}${x}`;
  await p.goto(url()); await p.evaluate(() => localStorage.clear()); await p.goto(url()); await p.waitForTimeout(600);
  let n = 0;
  const name = (s) => `shots/${market}-${theme}-${prefix}-${String(++n).padStart(2, '0')}-${s}.png`;
  const shot = async (s) => { await p.waitForTimeout(350); const f = name(s); await p.screenshot({ path: f }); return f };
  const full = async (s) => { await p.waitForTimeout(400); const el = await p.$('.app-main .app-scroll'); const h = el ? await el.evaluate(e => e.scrollHeight) : 880; await p.setViewportSize({ width: 420, height: Math.min(4000, h + 160) }); await p.waitForTimeout(300); if (el) await el.evaluate(e => e.scrollTop = e.scrollHeight); await p.waitForTimeout(200); const f = name(s); await p.screenshot({ path: f }); await p.setViewportSize({ width: 420, height: 880 }); return f };
  const nav = async (i) => { await p.click(`.gr-nav button:nth-child(${i})`); await p.waitForTimeout(350) };
  const ask = async (t, w = 700) => { await p.fill('.gr-ask input', t); await p.press('.gr-ask input', 'Enter'); await p.waitForTimeout(w) };
  const btn = (text, exact) => p.getByRole('button', { name: text, exact: !!exact }).last();
  const click = async (text, exact) => { const l = btn(text, exact); await l.scrollIntoViewIfNeeded(); await l.click(); await p.waitForTimeout(450) };
  const state = () => p.evaluate(() => JSON.parse(localStorage.getItem('gratifi-state-v3-' + new URLSearchParams(location.search).get('m'))));
  const summ = async (tag) => { const s = await state(); const o = { tag, balance: s.balance, card: s.card.balance, frozen: s.card.frozen, bookings: s.bookings.map(x => `${x.ref} ${x.cat} ${x.title} ${x.status} tot=${x.total} pts=${x.pts} card=${x.card} earned=${x.earned}`), ledger: s.ledger.slice(0, 6).map(l => `${l.pts} ${l.label}`), txns: s.txns.slice(0, 4).map(t => `${t.amount}${t.refund ? 'R' : ''} ${t.merchant} ${t.points}`) }; console.log(JSON.stringify(o, null, 1)); return s };
  const lastText = async () => p.evaluate(() => { const a = [...document.querySelectorAll('.gr-answer')]; return a.length ? a[a.length - 1].innerText : '' });
  const log = (...a) => console.log(...a); const last = async (s) => { await p.waitForTimeout(400); const a = p.locator(".gr-answer").last(); const f = name(s); await a.screenshot({ path: f }).catch(()=>{}); return f };
  const h = { last, p, shot, full, nav, ask, click, btn, state, summ, lastText, log, errs, market, url };
  try { await require(require('path').resolve(steps))(h) } catch (e) { errs.push('SCRIPT ' + e.message.split('\n')[0]); await shot('fail') }
  const e2 = await p.evaluate(() => window.__errs || []).catch(() => []);
  console.log(market, prefix, (errs.length || e2.length) ? 'ERRORS: ' + [...errs, ...e2].join(' | ').slice(0, 2000) : 'clean');
  await b.close();
})();
