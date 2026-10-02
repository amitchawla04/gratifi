// Interactive Playwright server: POST JS body -> eval in async ctx with p, helpers.
const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
const http = require('http'), fs = require('fs');
const G = '/tmp/claude-0/-home-claude/d2529b2f-e36e-5c22-8d08-213fa2f214ae/scratchpad/gratifi/review';
const R = __dirname;
let b, ctx, p, errs = [], n = 0;
const H = {};
H.open = async (q = 'm=UK', { clear = true, file = 'test.html', w = 420, h = 880, scale = 1 } = {}) => {
  if (ctx) await ctx.close();
  ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: scale });
  p = await ctx.newPage(); H.p = p; errs = [];
  p.on('pageerror', e => errs.push('PAGE ' + e.message)); p.on('console', m => { if (m.type() === 'error') errs.push('CON ' + m.text()) });
  await p.goto(`file://${G}/${file}?${q}`); if (clear) { await p.evaluate(() => localStorage.clear()); await p.goto(`file://${G}/${file}?${q}`) } await p.waitForTimeout(600);
  return 'opened';
};
H.reload = async () => { await p.reload(); await p.waitForTimeout(600); return 'reloaded' };
H.nav = async (i) => { await p.click(`.gr-nav button:nth-child(${i})`); await p.waitForTimeout(300) };
H.ask = async (t, wait = 700) => { await p.fill('.gr-ask input', t); await p.press('.gr-ask input', 'Enter'); await p.waitForTimeout(wait); return H.last() };
H.last = async () => p.evaluate(() => { const a = [...document.querySelectorAll('.gr-answer')].pop(); return a ? a.innerText : '' });
H.text = async (sel = '.app-main') => p.evaluate(s => document.querySelector(s)?.innerText, sel);
H.btn = async (name, opt = {}) => { const l = p.getByRole('button', { name, exact: !!opt.exact }).nth(opt.nth ?? -1); await l.scrollIntoViewIfNeeded(); await l.click(); await p.waitForTimeout(opt.wait || 500) };
H.btns = async (scope = '.gr-answer') => p.evaluate(s => { const a = [...document.querySelectorAll(s)].pop(); return a ? [...a.querySelectorAll('button')].map(x => (x.disabled ? '[x]' : '') + (x.getAttribute('aria-label') || x.innerText).replace(/\s+/g, ' ').trim()).filter(Boolean) : [] }, scope);
H.sheet = async () => p.evaluate(() => document.querySelector('.app-sheet')?.innerText || null);
H.confirm = async (code = '482193') => { await p.waitForTimeout(300); const s = await p.$('.app-sheet'); if (!s) return 'NO SHEET'; const t = await s.innerText(); const ins = await p.$$('.app-sheet input'); if (ins.length >= 6) { for (let i = 0; i < 6; i++) await ins[i].fill(code[i]) } else if (ins.length) await ins[0].fill(code); await p.locator('.app-sheet .gr-btn').last().click(); await p.waitForTimeout(1800); return t };
H.state = async (m) => p.evaluate(m => { const k = Object.keys(localStorage).find(k => k.startsWith('gratifi-state-v3-' + (m || ''))); return JSON.parse(localStorage.getItem(k)) }, m);
H.money = async () => { const s = await H.state(); return { pts: s.balance, cardBal: s.card.balance, limit: s.card.limit, due: s.card.due, bookings: s.bookings.map(b => `${b.ref} ${b.cat} ${b.status} tot=${b.total} pts=${b.pts} card=${b.card} earned=${b.earned || 0} ref=${JSON.stringify(b.refunded || '')}`), ledger: s.ledger.slice(0, 6).map(l => l.label + ' ' + l.pts), txns: s.txns.slice(0, 5).map(t => t.merchant + ' ' + t.amount + (t.refund ? ' R' : '') + (t.pending ? ' P' : '')) } };
H.shot = async (name, full = false) => { await p.waitForTimeout(300); const f = `${R}/shots/${String(++n).padStart(3, '0')}-${name}.png`; if (full) { const onChat = await p.$('.app[data-tab=chat]'); const el = await p.$('.app-main .app-scroll'); const hgt = el ? await el.evaluate(e => e.scrollHeight) : 880; const vs = p.viewportSize(); if (onChat) { await p.evaluate(() => { const e = document.querySelector('.app-main .app-scroll'); e.scrollTop = e.scrollHeight }); await p.waitForTimeout(300); await p.screenshot({ path: f }) } else { await p.setViewportSize({ width: vs.width, height: Math.min(5000, hgt + 200) }); await p.waitForTimeout(300); await p.screenshot({ path: f }); await p.setViewportSize(vs) } } else { await p.evaluate(() => { const e = document.querySelector('.app-main .app-scroll'); if (e && document.querySelector('.app[data-tab=chat]')) e.scrollTop = e.scrollHeight }); await p.screenshot({ path: f }) } return f };
H.errs = () => { const e = errs; errs = []; return e };
H.sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  b = await chromium.launch();
  await H.open();
  http.createServer((req, res) => { let body = ''; req.on('data', d => body += d); req.on('end', async () => {
    let out; try { const f = new Function('H', 'p', `return (async()=>{ const {nav,ask,last,btn,btns,sheet,confirm,state,money,shot,text,open,reload,sleep}=H; ${body} })()`); out = await f(H, H.p); } catch (e) { out = 'ERR ' + (e.stack || e).toString().split('\n').slice(0, 3).join(' | ') }
    const e = H.errs(); res.end((typeof out === 'string' ? out : JSON.stringify(out, null, 1)) + (e.length ? '\n!!ERRS: ' + e.join(' | ').slice(0, 800) : '') + '\n');
  }) }).listen(9315, () => console.log('ready'));
})();
