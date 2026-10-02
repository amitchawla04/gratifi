const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
const R = '/tmp/claude-0/-home-claude/d2529b2f-e36e-5c22-8d08-213fa2f214ae/scratchpad/gratifi/review/';
const fs = require('fs');
module.exports = async function setup(market = 'UK', o = {}) {
  const theme = o.theme || 'light', file = o.ai ? 'test.html' : 'test.html';
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 420, height: 880 }, deviceScaleFactor: 1 });
  if (o.fake) await ctx.addInitScript({ path: __dirname + '/fake.js' });
  const p = await ctx.newPage();
  const errs = []; p.on('pageerror', e => errs.push('PAGE ' + e.message)); p.on('console', m => { if (m.type() === 'error') errs.push('CON ' + m.text()) });
  const url = (x = '') => `file://${R}${file}?m=${market}&theme=${theme}${x}`;
  await p.goto(url()); if (!o.keep) await p.evaluate(() => localStorage.clear()); await p.goto(url()); await p.waitForTimeout(500);
  if (o.zoom) await p.evaluate(z => document.documentElement.style.fontSize = z, o.zoom);
  const tag = o.tag || market; let n = 0;
  const shot = async (name, fullpage) => { await p.waitForTimeout(300); const f = `shots/${tag}-${String(++n).padStart(2, '0')}-${name}.png`;
    if (fullpage) { const el = await p.$('.app-main .app-scroll'); const h = el ? await el.evaluate(e => e.scrollHeight) : 880; await p.setViewportSize({ width: 420, height: Math.min(5000, h + 200) }); await p.waitForTimeout(250); await p.screenshot({ path: f }); await p.setViewportSize({ width: 420, height: 880 }) }
    else { await p.evaluate(() => { const e = document.querySelector('.app-main .app-scroll'); if (e && document.querySelector('.app[data-tab=chat]')) e.scrollTop = e.scrollHeight }); await p.waitForTimeout(150); await p.screenshot({ path: f }) } return f };
  const nav = async (i) => { await p.click(`.gr-nav button:nth-child(${i})`); await p.waitForTimeout(300) };
  const ask = async (t, w = 700) => { await p.fill('.gr-ask input', t); await p.press('.gr-ask input', 'Enter'); await p.waitForTimeout(w) };
  const last = () => p.locator('.gr-answer').last();
  const lastText = async () => (await last().innerText()).replace(/\s+/g, ' ');
  const btn = async (name, o2 = {}) => { const l = p.getByRole('button', { name, exact: !!o2.exact }).last(); await l.scrollIntoViewIfNeeded(); await l.click({ timeout: 4000 }); await p.waitForTimeout(o2.w || 450) };
  const confirm = async (code) => { await p.waitForTimeout(300); const s = await p.$('.app-sheet'); if (!s) return 'NOSHEET'; const t = (await s.innerText()).replace(/\s+/g, ' '); const ins = await p.$$('.app-sheet input'); if (ins.length >= 6) { for (let i = 0; i < 6; i++) await ins[i].fill((code || '482193')[i]) } else if (ins.length) await ins[0].fill(code || '482193'); await p.locator('.app-sheet .gr-btn').last().click(); await p.waitForSelector('.app-sheet', { state: 'detached', timeout: 9000 }).catch(() => errs.push('SHEET STUCK')); await p.waitForTimeout(400); return t };
  const st = () => p.evaluate(m => JSON.parse(localStorage.getItem('gratifi-state-v3-' + m) || 'null'), market);
  const keys = () => p.evaluate(() => Object.keys(localStorage));
  const close = async () => { if (errs.length) console.log('ERRS', errs.join(' | ').slice(0, 800)); await b.close() };
  return { b, p, shot, nav, ask, last, lastText, btn, confirm, st, keys, close, errs, url };
};
